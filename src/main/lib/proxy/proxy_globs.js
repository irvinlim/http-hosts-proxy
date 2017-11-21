import { DomainNames } from 'domain-tree';

let globDomainTree = new DomainNames();

/**
 * Populates the domain name tree with a given array of hostname mappings.
 *
 * Filters out any hostnames which do not have globs, and creates a tree from the
 * remaining nodes, iterated by domain name order.
 *
 * The resultant tree thus consists of nodes starting from the top-level domains (TLDs),
 * all the way to the subdomains at the leaf nodes. The (*) node is excluded from the
 * tree as well.
 *
 * @param {Object[]} mappings
 */
export const populate = mappings => {
  mappings.forEach(addNode);
};

/**
 * Inserts a node into the tree.
 * @param {Object} mapping
 */
export const addNode = mapping => {
  // First check if it is a glob mapping.
  if (!isGlobMapping(mapping)) {
    return;
  }

  // Add the hostname to the tree.
  globDomainTree.addDomain(mapping.hostname, mapping);
};

/**
 * Performs a hostname lookup within the tree.
 * The target hostname to be queried will be matched against the nodes in the tree
 * as we traverse downwards. If the target hostname contains more domain parts than
 * what is left over after reaching a leaf node, then we successfully matched a glob
 * in the tree.
 *
 * @param {string} hostname
 * @return {Object|boolean} Returns the hostname mapping data if a match is found, or
 * false otherwise.
 */
export const lookupGlob = hostname => {
  // Skip if there are no globs to operate on.
  if (globDomainTree.root.children.length <= 0) {
    return false;
  }

  // Start from the root of the tree.
  let currentNode = globDomainTree.root;

  // Split the hostname by '.' separator.
  // We will iterate this as a stack.
  const hostnameParts = hostname.split('.');

  while (currentNode.children.length > 0 && hostnameParts.length > 0) {
    // Peek the top of the stack.
    let currentQuery = hostnameParts[hostnameParts.length - 1];

    // Match the children of the current node.
    if (currentNode.getNode(currentQuery)) {
      // Traverse to the matching child.
      currentNode = currentNode.getNode(currentQuery);
      // Pop the top of the stack.
      hostnameParts.pop();
    } else if (currentNode.getNode('*')) {
      // If we have reached the leaf node, we can break.
      currentNode = currentNode.children[0];
      break;
    } else {
      // No match. Break out of the loop.
      break;
    }
  }

  // Only if we have reached a leaf node and we have hostname segments left over,
  // does it mean that the given hostname matches the glob in the tree.
  if (hostnameParts.length > 0 && currentNode.children.length <= 0) {
    return { ...currentNode.data };
  }

  return false;
};

/**
 * Determines if a given hostname mapping is a glob.
 * @param {Object} mapping
 */
const isGlobMapping = mapping => mapping.hostname.indexOf('*.') === 0;
