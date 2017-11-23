import { getAddress, getHostHeader, getMapping } from './proxy_storage';

import { lookupGlob } from './proxy_globs';

/**
 * Recursively looks up the address that a given hostname should resolve to.
 * This is the "DNS lookup" query that the proxy is performing.
 * This method fetches the lookup table stored in user data.
 * @param {string} hostname The hostname to resolve.
 * @return {string} The IP address or domain name that the given hostname should resolve to. If a
 *                  FQDN is returned, then the upstream DNS server will resolve it instead.
 */
export const lookupAddress = hostname => {
  // Helper method to keep track of visited entries.
  const lookupHelper = (currentHostname, visited) => {
    // Handle null hostnames.
    if (!currentHostname || !currentHostname.length) {
      return null;
    }

    // Look up hostname to get the next address that it resolves to.
    let address = getAddress(currentHostname);

    // If there is no exact match, attempt to match a glob.
    if (!address) {
      const matchedGlob = lookupGlob(currentHostname);

      if (matchedGlob) {
        address = matchedGlob.address;
      }
    }

    // Base case: If we cannot resolve the hostname, it resolves to itself.
    if (!address) {
      return currentHostname;
    }

    // Base case: We have visited the next node before, so we return the current hostname.
    if (visited.indexOf(address) >= 0) {
      return currentHostname;
    }

    // Perform recursive step, adding the next address to visited.
    visited.push(address);
    return lookupHelper(address, visited);
  };

  return lookupHelper(hostname, [hostname]);
};

/**
 * Looks up the Host header within the hostname mappings.
 * @param {string} hostname Hostname to look up.
 * @return {string} Host header for a hostname that exists in the mappings;
 * it can either be an exact match or matched by a glob.
 */
export const lookupHostHeader = hostname => {
  // If there is an exact match, we will use that hostname's data.
  const mapping = getMapping(hostname);

  if (mapping) {
    return getHostHeader(hostname);
  }

  // Otherwise, attempt to match a glob.
  const globMapping = lookupGlob(hostname);

  if (globMapping) {
    return getHostHeader(globMapping.hostname);
  }

  return null;
};
