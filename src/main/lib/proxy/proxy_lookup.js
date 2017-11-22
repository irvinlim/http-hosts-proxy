import { getMapping } from './proxy_storage';
import { lookupGlob } from './proxy_globs';

/**
 * Recursively looks up the address that a given hostname should resolve to.
 * This is the "DNS lookup" query that the proxy is performing.
 * This method fetches the lookup table stored in user data.
 * @param {string} hostname The hostname to resolve.
 * @return {string} The IP address or domain name that the given hostname should resolve to. If a
 *                  FQDN is returned, then the upstream DNS server will resolve it instead.
 */
export const lookup = hostname => {
  // Helper method to keep track of visited entries.
  const lookupHelper = (hostname, visited) => {
    // Handle null hostnames.
    if (!hostname || !hostname.length) {
      return null;
    }

    // Look up hostname in the hostname mappings.
    let address = getMapping(hostname);

    // If there is no exact match, attempt to match a glob.
    if (!address) {
      const mapping = lookupGlob(hostname);

      if (mapping) {
        address = mapping.address;
      }
    }

    // If there is no mapping, the hostname resolves to itself.
    if (!address) {
      return hostname;
    }

    // Base case: We have visited the next node before.
    // This node should be the result.
    if (visited.indexOf(address) >= 0) {
      return hostname;
    }

    // Add the resolved address into the visited array.
    visited.push(address);

    // Otherwise, we recursively get mappings.
    return lookupHelper(address, visited);
  };

  return lookupHelper(hostname, [hostname]);
};
