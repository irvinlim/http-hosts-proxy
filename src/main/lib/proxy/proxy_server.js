import URL from 'url-parse';
import http from 'http';
import httpProxy from 'http-proxy';
import { lookup } from './proxy_lookup';
import net from 'net';

// Instantiates a proxy server for forwarding requests.
const proxy = httpProxy.createProxyServer();

// Creates a HTTP server locally.
const server = http.createServer();

// Handle HTTP requests.
server.on('request', function(req, res) {
  let { protocol, host, hostname, port } = new URL(req.url);

  // Default to HTTP if not specified.
  port = port || 80;

  // Default Host header to the parsed host in the URL.
  const hostHeader = req.headers.host || host;

  console.info(`Using ${hostHeader} as the Host header.`);

  // Recursively lookup address that hostname should resolve to.
  const resolved = lookup(hostname);

  // Logging
  if (hostname !== resolved) {
    console.info(`Resolved ${hostname} to ${resolved}.`);
  }

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

// Handle HTTP CONNECT requests, which emits 'upgrade' events.
server.on('connect', function(req, socket) {
  // Extract hostname and port from the CONENCT request URL.
  const [hostname, port] = req.url.split(':', 2);

  const conn = net.connect(port, hostname, function() {
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
});

// Handle all proxy errors like ECONNRESET, ENOTFOUND, etc.
// Returns a RESTful error message, which can be consumed by Chrome extensions, etc.
proxy.on('error', function(err, req, res) {
  // Send a 500 status code.
  res.writeHead(500, { 'Content-Type': 'application/json' });

  // Send some information about the error.
  const error = {
    error: 'dns_switcher_proxy_error',
    code: err.code,
    message: err.message,
  };

  res.end(JSON.stringify(error));
});

// TODO: Support all other protocols.
export const start = port => {
  server.listen(port);
};
