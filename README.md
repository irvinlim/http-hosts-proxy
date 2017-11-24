# http-hosts-proxy

[![Travis CI](https://img.shields.io/travis/irvinlim/http-hosts-proxy.svg?style=flat-square)](https://travis-ci.org/irvinlim/http-hosts-proxy)
[![AppVeyor](https://img.shields.io/appveyor/ci/irvinlim/http-hosts-proxy.svg?style=flat-square)](https://ci.appveyor.com/project/irvinlim/http-hosts-proxy)
[![GitHub](https://img.shields.io/github/release/irvinlim/http-hosts-proxy.svg?style=flat-square)](https://github.com/irvinlim/http-hosts-proxy/releases)
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)

**http-hosts-proxy** is a HTTP(S) proxy server for hostname-based mapping to custom addresses, based on [Electron](https://electronjs.org) and [Vue](https://vuejs.org). It is primarily a developer tool for users who constantly have to switch between hosts.

A Google Chrome extension that natively integrates with **http-hosts-proxy** is planned for and development is underway. This would help you to configure Google Chrome's proxy settings automatically based on hostname, as well as additional features for ease of use.

## Why do I need it?

If you do local web development you might have needed to do edit `/etc/hosts` to resolve a custom hostname such as `mysite.local` to `localhost`, for example. It has always been a hassle to edit the file manually, especially if you often have to add new hostnames or subdomains.

Additionally, if you ever needed to switch between IP addresses without modifying your public DNS records, you might have needed to constantly edit `/etc/hosts` to toggle between IP addresses. Your browser may have also cached DNS lookups, which makes it even more of a hassle to go through.

**http-hosts-proxy** helps developers to solve these problems using a proxy server to serve your requests instead. Similar to how one can use a reverse proxy to easily load balance between origins, this helps you to easily configure hostname mappings to target addresses.

## Features

- HTTP/HTTPS/WebSockets proxy server based on Node.js
- Map a hostname to an IP address or another FQDN
- Recursively resolve hostname mappings (similar to how DNS works)
- Wildcard hostnames (e.g. `*.example.com`) are supported
- Set a custom `Host` request header to be sent to the origin server
- Quickly toggle hostname mappings on and off

## Usage

1. Download and install the Electron app.
1. Start the proxy server if it is not started already. Change the binding port number if you wish.
1. Modify your browser or OS settings to use **http-hosts-proxy** as your proxy server.

This will cause traffic to go through the proxy. Any hostname mappings that are configured within **http-hosts-proxy** will be proxied to the specified address, while all other traffic will simply be passed through.

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
