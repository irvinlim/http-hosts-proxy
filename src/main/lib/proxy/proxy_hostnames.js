import { DomainNames } from 'domain-tree';

let globDomainTree = new DomainNames();

export const populate = mappings => {
  // Filter only mappings with domain globs in the hostname.
  const globMappings = mappings.filter(isGlobMapping);

  // Remove the '*' from the hostname.
  const strippedMappings = globMappings.map(stripGlob);

  // Add hostnames which have a glob to the tree.
  strippedMappings.forEach(({ hostname, ...data }) => {
    globDomainTree.addDomain(hostname, data);
  });
};

export const addNode = mapping => {
  // First check if it is a glob mapping.
  if (!isGlobMapping(mapping)) {
    return;
  }

  // Strip out globs from the hostname.
  const strippedMapping = stripGlob(mapping);

  // Add the hostname to the tree.
  globDomainTree.addDomain(strippedMapping);
};

export const lookupGlob = hostname => {
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

const isGlobMapping = mapping => mapping.hostname.indexOf('*.') === 0;
const stripGlob = ({ hostname, ...data }) => ({
  hostname: hostname.replace(/(\*\.|\*)/g, ''),
  ...data,
});
