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
  // Recreate the tree.
  globDomainTree = new DomainNames();

  // Add all nodes.
  mappings.forEach(addNode);
};

/**
 * Counts the number of leaves in the tree. This will be equal to the number of
 * domain names that are added to the tree.
 * @return {number} Total number of leaves in the tree.
 */
export const countLeaves = () => {
  const queue = [];

  // Enqueue all children of the root node.
  globDomainTree.root.children.forEach(child => queue.push(child));

  // Maintain a count.
  let count = 0;

  while (queue.length > 0) {
    const node = queue.shift();

    if (node.children.length > 0) {
      node.children.forEach(child => queue.push(child));
    } else {
      count++;
    }
  }

  return count;
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

  // Split the hostname by '.' separator.
  // We will iterate this as a stack from right to left.
  const hostnameParts = hostname.split('.');

  /**
   * Traverses the domain name tree to recursively find the furthest leaf node (i.e. nodes that
   * end with '*') that can be traversed to which follows a path as given by hostnameParts.
   * @param {DomainName} currentNode
   * @param {string[]} stack
   */
  const traverseTree = (currentNode, stack) => {
    // Handle base case: Failed query.
    if (currentNode.children.length <= 0 || stack.length <= 0) {
      return false;
    }

    // Peek the top of the stack.
    let currentQuery = stack[stack.length - 1];

    // Find matching nodes, if available.
    const queryNode = currentNode.getNode(currentQuery);
    const leafNode = currentNode.getNode('*');

    // Create a new array with the last element popped off.
    const poppedStack = stack.slice(0, stack.length - 1);

    // Handle special case of nested globs: Need to branch here.
    // Try to resolve the longer chain; otherwise we fallback to the shorter one.
    if (queryNode && leafNode) {
      return traverseTree(queryNode, poppedStack) || leafNode;
    }

    // Otherwise, if we have a query node, we traverse down to the queryNode.
    if (queryNode) {
      return traverseTree(queryNode, poppedStack);
    }

    // Otherwise, we check if we have reached leaf node.
    if (leafNode) {
      return leafNode;
    }

    return false;
  };

  // Run the tree traversal from the root of the tree.
  const furthestLeafNode = traverseTree(globDomainTree.root, hostnameParts);

  // Handle failed queries.
  if (!furthestLeafNode) {
    return false;
  }

  // Return the hostname mapping.
  return { ...furthestLeafNode.data };
};

/**
 * Determines if a given hostname mapping is a glob.
 * @param {Object} mapping
 */
const isGlobMapping = mapping => mapping.hostname.indexOf('*.') === 0;
