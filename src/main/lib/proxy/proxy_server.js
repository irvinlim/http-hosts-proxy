import { lookupAddress, lookupHostHeader } from './proxy_lookup';

import URL from 'url-parse';
import http from 'http';
import httpProxy from 'http-proxy';
import log from 'electron-log';
import net from 'net';

// Instantiates a proxy server for forwarding requests.
const proxy = httpProxy.createProxyServer();

// Creates a HTTP server locally.
const server = http.createServer();

// Handle HTTP requests.
server.on('request', function(req, res) {
  let { protocol, hostname, port, pathname, query } = new URL(req.url);

  // Default to HTTP if not specified.
  port = port || 80;

  // Recursively lookup address that hostname should resolve to.
  const resolved = lookupAddress(hostname);

  // Look up the Host header in the hostname mappings, or otherwise default to
  // the Host header in the request, or the hostname in the parsed URL.
  const hostHeader = lookupHostHeader(hostname) || req.headers.host || hostname;

  // Get the new URL that we want to proxy to.
  const newUrl = `${protocol}//${resolved}:${port}${pathname}${query}`;

  // Do some logging.
  if (hostname !== resolved) {
    log.info(`Resolved ${req.url} to ${newUrl}.`);
  }

  log.debug(`Making HTTP request to ${newUrl}.`);

  // Proxy HTTP(S) requests.
  proxy.web(req, res, {
    // Set up proxy to remote host.
    target: `${protocol}//${resolved}:${port}`,

    // Forward the original host.
    headers: { Host: `${hostHeader}` },

    // Enforce SSL certificate verification.
    secure: true,
  });
});

// Handle HTTP CONNECT requests for proxying HTTPS requests.
server.on('connect', function(req, socket) {
  // Extract hostname and port from the CONNECT request URL.
  const [hostname, port] = req.url.split(':', 2);

  // Recursively lookup address that hostname should resolve to.
  const resolved = lookupAddress(hostname);

  // Get the new address that we want to make a CONNECT tunnel to.
  const newUrl = `${resolved}:${port}`;

  // Do some logging.
  if (hostname !== resolved) {
    log.info(`Resolved ${req.url} to ${newUrl}.`);
  }

  log.debug(`Initiating CONNECT tunnel to ${newUrl}.`);

  const conn = net.connect(port, resolved, function() {
    // Info logging
    log.debug(`Successfully established CONNECT tunnel to ${newUrl}.`);

    // Respond to client that connection was made.
    const responseLines = [
      'HTTP/1.1 200 Connection Established',
      'Connection: close',
      '',
    ];

    // Send the raw HTTP response string to the socket back to the client.
    const response = responseLines.map(line => `${line}\r\n`).join('');
    socket.write(response);

    // Create a tunnel between the two hosts.
    socket.pipe(conn);
    conn.pipe(socket);
  });

  // Handle tunnel errors gracefully.
  conn.on('error', function(err) {
    // Log error message.
    const message =
      `Could not establish HTTPS tunnel for ${req.url} to ${newUrl}: ` +
      err.code;
    log.error(message);
  });
});

// Handle all proxy errors like ECONNRESET, ENOTFOUND, etc.
// Returns a RESTful error message, which can be consumed by Chrome extensions, etc.
proxy.on('error', function(err, req, res) {
  // Log error message.
  const message = `Error while requesting "${req.url}": ` + err.code;
  log.error(message);

  // Send a 500 status code.
  res.writeHead(500, { 'Content-Type': 'application/json' });

  // Send some information about the error.
  const error = {
    error: 'http_hosts_proxy_error',
    code: err.code,
    message: err.message,
  };

  res.end(JSON.stringify(error));
});

export const isListening = () => {
  return server.listening;
};

export const getSocketAddress = () => {
  return server.address();
};

export const start = (port = 0, address = 'localhost') => {
  if (isListening()) {
    log.info(`Server already started on ${address}:${server.address().port}.`);
    return Promise.resolve();
  }

  // Start listening on specified port and address.
  server.listen(port, address);

  // Wait on either listening or error events to resolve the Promise.
  return new Promise((resolve, reject) => {
    server.on('listening', () => {
      log.info(`Server started on ${address}:${port}.`);
      resolve();
    });

    server.on('error', () => {
      log.error(`Could not start server on ${address}:${port}.`);
      reject();
    });
  });
};

export const stop = () => {
  if (!isListening()) {
    log.info('Could not stop server, server is not running.');
    return Promise.resolve();
  }

  return new Promise(resolve =>
    server.close(() => {
      log.info('Server stopped.');
      resolve();
    })
  );
};

export const restart = async (port = 0, address = '') => {
  await stop();
  await start(port, address);
};
