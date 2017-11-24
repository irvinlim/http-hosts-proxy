'use strict';

/* eslint-env mocha */

import { expect } from 'chai';
import { lookupHostHeader } from '../../../../src/main/lib/proxy/proxy_lookup';
import proxy from '../../../../src/main/lib/proxy';

const { getMappings, putMappings } = proxy.storage;
const { countLeaves } = proxy.globs;
const { lookupAddress } = proxy.lookup;

describe('lib.proxy.lookup', function() {
  describe('#lookupAddress', function() {
    beforeEach(function() {
      putMappings({});
      expect(countLeaves()).to.be.eq(0);
      expect(getMappings()).to.be.empty;
    });

    it('should return the same hostname when there are no mappings', function() {
      expect(lookupAddress('test.example.com')).to.be.equal('test.example.com');
    });

    it('should return the same hostname when no mappings are matching', function() {
      putMappings({
        'test.example.com': { address: '1.2.3.4', active: true },
        'hello.mysite.net': { address: '5.6.7.8', active: true },
      });
      expect(lookupAddress('mycompany.xyz')).to.be.equal('mycompany.xyz');
    });

    it('should return a resolved address when a hostname exactly matches', function() {
      putMappings({
        'test.example.com': { address: '1.2.3.4', active: true },
        'hello.mysite.net': { address: '5.6.7.8', active: true },
      });
      expect(lookupAddress('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookupAddress('hello.mysite.net')).to.be.equal('5.6.7.8');
    });

    it('should recursively resolve addresses stored in the mappings', function() {
      putMappings({
        'test.example.com': { address: 'hello.mysite.net', active: true },
        'hello.mysite.net': { address: '5.6.7.8', active: true },
      });
      expect(lookupAddress('hello.mysite.net')).to.be.equal('5.6.7.8');
      expect(lookupAddress('test.example.com')).to.be.equal('5.6.7.8');
    });

    it('should resolve glob hostnames correctly', function() {
      putMappings({
        '*.example.com': { address: '1.2.3.4', active: true },
        'hello.mysite.net': { address: '5.6.7.8', active: true },
      });
      expect(lookupAddress('example.com')).to.be.equal('example.com');
      expect(lookupAddress('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookupAddress('another.test.example.com')).to.be.equal('1.2.3.4');
      expect(lookupAddress('yet.another.test.example.com')).to.be.equal(
        '1.2.3.4'
      );
    });

    it('should resolve nested glob hostnames correctly', function() {
      putMappings({
        '*.test.example.com': { address: '1.2.3.4', active: true },
        '*.example.com': { address: '5.6.7.8', active: true },
      });
      expect(lookupAddress('example.com')).to.be.equal('example.com');
      expect(lookupAddress('test.example.com')).to.be.equal('5.6.7.8');
      expect(lookupAddress('another.test.example.com')).to.be.equal('1.2.3.4');
      expect(lookupAddress('yet.another.test.example.com')).to.be.equal(
        '1.2.3.4'
      );
    });

    it('should resolve absolute hostnames before glob hostnames', function() {
      putMappings({
        '*.example.com': { address: '5.6.7.8', active: true },
        'test.example.com': { address: '1.2.3.4', active: true },
      });
      expect(lookupAddress('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookupAddress('test2.example.com')).to.be.equal('5.6.7.8');
    });

    it('should recursively resolve glob hostnames into absolute hostnames', function() {
      putMappings({
        '*.example.com': { address: 'test.example.com', active: true },
        'test.example.com': { address: '1.2.3.4', active: true },
      });
      expect(lookupAddress('example.com')).to.be.equal('example.com');
      expect(lookupAddress('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookupAddress('test2.example.com')).to.be.equal('1.2.3.4');
      expect(lookupAddress('test3.test.example.com')).to.be.equal('1.2.3.4');
    });

    it('should not enter an infinite loop when doing recursively resolving hostnames', function() {
      putMappings({
        'test.example.com': { address: 'test.example.com', active: true },
      });
      expect(lookupAddress('test.example.com')).to.be.equal('test.example.com');
    });

    it('should return the last visited node when entering recursively entering a cycle', function() {
      // Cycle of two nodes
      putMappings({
        'test1.example.com': { address: 'test2.example.com', active: true },
        'test2.example.com': { address: 'test1.example.com', active: true },
      });
      expect(lookupAddress('test1.example.com')).to.be.equal(
        'test2.example.com'
      );
      expect(lookupAddress('test2.example.com')).to.be.equal(
        'test1.example.com'
      );

      // Cycle of three nodes
      putMappings({
        'test1.example.com': { address: 'test2.example.com', active: true },
        'test2.example.com': { address: 'test3.example.com', active: true },
        'test3.example.com': { address: 'test1.example.com', active: true },
      });
      expect(lookupAddress('test1.example.com')).to.be.equal(
        'test3.example.com'
      );
      expect(lookupAddress('test2.example.com')).to.be.equal(
        'test1.example.com'
      );
      expect(lookupAddress('test3.example.com')).to.be.equal(
        'test2.example.com'
      );
    });

    it('should return the same hostname if all mappings are inactive', function() {
      putMappings({
        'test.example.com': { address: '1.2.3.4', active: false },
        '*.example.com': { address: '5.6.7.8', active: false },
      });
      expect(lookupAddress('test.example.com')).to.be.equal('test.example.com');
    });

    it('should match the glob address if the exact match is inactive', function() {
      putMappings({
        'test.example.com': { address: '1.2.3.4', active: false },
        '*.example.com': { address: '5.6.7.8', active: true },
      });
      expect(lookupAddress('test.example.com')).to.be.equal('5.6.7.8');
    });

    it('should match the less specific glob address if a more specific glob address is inactive', function() {
      putMappings({
        '*.test.example.com': { address: '1.2.3.4', active: false },
        '*.example.com': { address: '5.6.7.8', active: true },
      });
      expect(lookupAddress('hello.test.example.com')).to.be.equal('5.6.7.8');
      expect(lookupAddress('test.example.com')).to.be.equal('5.6.7.8');
    });
  });

  describe('#lookupHostHeader', function() {
    it('should return null if there are no mappings', function() {
      expect(lookupHostHeader('test.example.com')).to.be.null;
    });

    it('should return null if no mappings are matching', function() {
      putMappings({
        'test.example.com': { address: '1.2.3.4', active: true },
      });
      expect(lookupHostHeader('hello.mysite.net')).to.be.null;
    });

    it('should return the Host header value if there is an exact match', function() {
      putMappings({
        'test.example.com': {
          address: '1.2.3.4',
          active: true,
          hostHeader: 'host.example.com',
        },
      });
      expect(lookupHostHeader('test.example.com')).to.be.equal(
        'host.example.com'
      );
    });

    it('should return null if there is an exact match without a hostHeader value', function() {
      putMappings({
        'test.example.com': { address: '1.2.3.4', active: true },
      });
      expect(lookupHostHeader('test.example.com')).to.be.null;
    });

    it('should return the Host header value if there is a glob match', function() {
      putMappings({
        '*.example.com': {
          address: '1.2.3.4',
          active: true,
          hostHeader: 'host.example.com',
        },
      });
      expect(lookupHostHeader('test.example.com')).to.be.equal(
        'host.example.com'
      );
      expect(lookupHostHeader('hello.example.com')).to.be.equal(
        'host.example.com'
      );
    });

    it('should return null if there is a glob match without a hostHeader value', function() {
      putMappings({
        '*.example.com': { address: '1.2.3.4', active: true },
      });
      expect(lookupHostHeader('test.example.com')).to.be.null;
      expect(lookupHostHeader('hello.example.com')).to.be.null;
    });

    it('should return null if all mappings are inactive', function() {
      putMappings({
        'test.example.com': {
          address: '1.2.3.4',
          active: false,
          hostHeader: 'host.example.com',
        },
        '*.example.com': {
          address: '1.2.3.4',
          active: false,
          hostHeader: 'host.example.com',
        },
      });
      expect(lookupHostHeader('test.example.com')).to.be.null;
      expect(lookupHostHeader('hello.example.com')).to.be.null;
    });

    it('should return the Host header for the glob if the exact match is inactive ', function() {
      putMappings({
        'test.example.com': {
          address: '1.2.3.4',
          active: false,
          hostHeader: 'host.test.example.com',
        },
        '*.example.com': {
          address: '1.2.3.4',
          active: true,
          hostHeader: 'host.example.com',
        },
      });
      expect(lookupHostHeader('test.example.com')).to.be.equal(
        'host.example.com'
      );
      expect(lookupHostHeader('hello.example.com')).to.be.equal(
        'host.example.com'
      );
    });

    it('should return the Host header for the less specific glob if the more specific one is inactive', function() {
      putMappings({
        '*.test.example.com': {
          address: '1.2.3.4',
          active: false,
          hostHeader: 'host.test.example.com',
        },
        '*.example.com': {
          address: '1.2.3.4',
          active: true,
          hostHeader: 'host.example.com',
        },
      });
      expect(lookupHostHeader('hello.test.example.com')).to.be.equal(
        'host.example.com'
      );
      expect(lookupHostHeader('hello.example.com')).to.be.equal(
        'host.example.com'
      );
    });
  });
});
