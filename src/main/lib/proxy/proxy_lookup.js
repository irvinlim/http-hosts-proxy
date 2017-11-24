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
  const lookupHelper = (currentHostname, visited) => {
    // Handle null hostnames.
    if (!currentHostname || !currentHostname.length) {
      return null;
    }

    // Look up hostname to get the next address that it resolves to.
    const mapping = getMapping(currentHostname);
    let address;

    // Extract out the address field if there is an exact match.
    if (mapping) {
      address = mapping.address;
    }

    // Otherwise, attempt to match a glob.
    const matchedGlob = lookupGlob(currentHostname);
    if (!address && matchedGlob) {
      address = matchedGlob.address;
    }

    // If there is no mapping, the hostname resolves to itself.
    if (!address) {
      return currentHostname;
    }

    // Base case: We have visited the next node before.
    // This node should be the result.
    if (visited.indexOf(address) >= 0) {
      return currentHostname;
    }

    // Add the resolved address into the visited array.
    visited.push(address);

    // Otherwise, we recursively get mappings.
    return lookupHelper(address, visited);
  };

  return lookupHelper(hostname, [hostname]);
};
