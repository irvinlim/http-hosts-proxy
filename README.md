# HTTP Hosts Proxy

[![Greenkeeper badge](https://badges.greenkeeper.io/irvinlim/http-hosts-proxy.svg)](https://greenkeeper.io/)

[![Travis CI](https://img.shields.io/travis/irvinlim/http-hosts-proxy.svg)](https://travis-ci.org/irvinlim/http-hosts-proxy)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/github/irvinlim/http-hosts-proxy?retina=true&svg=true)](https://ci.appveyor.com/project/irvinlim/http-hosts-proxy)
[![GitHub](https://img.shields.io/github/release/irvinlim/http-hosts-proxy.svg)](https://github.com/irvinlim/http-hosts-proxy/releases)
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg)](http://opensource.org/licenses/MIT)

> *NOTE: HTTP Hosts Proxy is still under active development. It may not be usable yet.*

**HTTP Hosts Proxy** is a developer tool that allows hostname-based mapping to custom addresses using a HTTP(S) proxy server, based on [Electron](https://electronjs.org) and [Vue](https://vuejs.org). It is primarily aimed at web developers who constantly have to switch between hosts locally.

A Google Chrome extension that natively integrates with **HTTP Hosts Proxy** is currently planned for as well, which makes local web development even more seamless.

## Why do I need it?

If you do local web development you might have needed to do edit `/etc/hosts` to resolve a custom hostname such as `mysite.local` to `localhost`, for example. It has always been a hassle to edit the file manually, especially if you often have to add new hostnames or subdomains.

Additionally, if you ever needed to switch between IP addresses without modifying your public DNS records, you might have needed to constantly edit `/etc/hosts` to toggle between IP addresses. Your browser may have also cached DNS lookups, which makes it even more of a hassle to go through.

**HTTP Hosts Proxy** helps developers to solve these problems using a proxy server to serve your requests instead. Similar to how one can use a reverse proxy to easily load balance between origins, this helps you to easily configure hostname mappings to target addresses.

## Features

- Cross-platform application for macOS, Linux and Windows
- HTTP/HTTPS/WebSockets proxy server based on Node.js
- Map a hostname to an IP address or another FQDN
- Recursively resolve hostname mappings (similar to how DNS works)
- Wildcard hostnames (e.g. `*.example.com`) are supported
- Set a custom `Host` request header to be sent to the origin server
- Quickly toggle hostname mappings on and off
- Integrated to Google Chrome as an extension (*coming soon*)

## Usage

1. Download and install the Electron app.
1. Start the proxy server if it is not started already. Change the binding port number if you wish.
1. Modify your browser or OS settings to use **HTTP Hosts Proxy** as your proxy server.

This will cause traffic to go through the proxy. Any hostname mappings that are configured within **HTTP Hosts Proxy** will be proxied to the specified address, while all other traffic will simply be passed through.

## Build setup

```sh
# Install dependencies
npm install

# Serve with hot reload
npm run dev

# Run tests
npm run test

# Lint all src and test code
npm run lint

# Build for production
npm run build
```

## License

[MIT](https://github.com/irvinlim/http-hosts-proxy/blob/master/LICENSE)
