'use strict';

/* eslint-env mocha */

import { expect } from 'chai';
import proxy from '../../../../src/main/lib/proxy';

const { getMappings, putMappings } = proxy.storage;
const { countLeaves } = proxy.globs;
const { lookup } = proxy.lookup;

describe('lib.proxy.lookup', function() {
  describe('#lookup', function() {
    beforeEach(function() {
      putMappings({});
      expect(countLeaves()).to.be.eq(0);
      expect(getMappings()).to.be.empty;
    });

    it('should return the same hostname when there are no mappings', function() {
      expect(lookup('test.example.com')).to.be.equal('test.example.com');
    });

    it('should return the same hostname when no mappings are matching', function() {
      putMappings({
        'test.example.com': { address: '1.2.3.4', active: true },
        'hello.mysite.net': { address: '5.6.7.8', active: true },
      });
      expect(lookup('mycompany.xyz')).to.be.equal('mycompany.xyz');
    });

    it('should return a resolved address when a hostname exactly matches', function() {
      putMappings({
        'test.example.com': { address: '1.2.3.4', active: true },
        'hello.mysite.net': { address: '5.6.7.8', active: true },
      });
      expect(lookup('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('hello.mysite.net')).to.be.equal('5.6.7.8');
    });

    it('should recursively resolve addresses stored in the mappings', function() {
      putMappings({
        'test.example.com': { address: 'hello.mysite.net', active: true },
        'hello.mysite.net': { address: '5.6.7.8', active: true },
      });
      expect(lookup('hello.mysite.net')).to.be.equal('5.6.7.8');
      expect(lookup('test.example.com')).to.be.equal('5.6.7.8');
    });

    it('should resolve glob hostnames correctly', function() {
      putMappings({
        '*.example.com': { address: '1.2.3.4', active: true },
        'hello.mysite.net': { address: '5.6.7.8', active: true },
      });
      expect(lookup('example.com')).to.be.equal('example.com');
      expect(lookup('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('another.test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('yet.another.test.example.com')).to.be.equal('1.2.3.4');
    });

    it('should resolve nested glob hostnames correctly', function() {
      putMappings({
        '*.test.example.com': { address: '1.2.3.4', active: true },
        '*.example.com': { address: '5.6.7.8', active: true },
      });
      expect(lookup('example.com')).to.be.equal('example.com');
      expect(lookup('test.example.com')).to.be.equal('5.6.7.8');
      expect(lookup('another.test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('yet.another.test.example.com')).to.be.equal('1.2.3.4');
    });

    it('should resolve absolute hostnames before glob hostnames', function() {
      putMappings({
        '*.example.com': { address: '5.6.7.8', active: true },
        'test.example.com': { address: '1.2.3.4', active: true },
      });
      expect(lookup('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('test2.example.com')).to.be.equal('5.6.7.8');
    });

    it('should recursively resolve glob hostnames into absolute hostnames', function() {
      putMappings({
        '*.example.com': { address: 'test.example.com', active: true },
        'test.example.com': { address: '1.2.3.4', active: true },
      });
      expect(lookup('example.com')).to.be.equal('example.com');
      expect(lookup('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('test2.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('test3.test.example.com')).to.be.equal('1.2.3.4');
    });

    it('should not enter an infinite loop when doing recursively resolving hostnames', function() {
      putMappings({
        'test.example.com': { address: 'test.example.com', active: true },
      });
      expect(lookup('test.example.com')).to.be.equal('test.example.com');
    });

    it('should return the last visited node when entering recursively entering a cycle', function() {
      // Cycle of two nodes
      putMappings({
        'test1.example.com': { address: 'test2.example.com', active: true },
        'test2.example.com': { address: 'test1.example.com', active: true },
      });
      expect(lookup('test1.example.com')).to.be.equal('test2.example.com');
      expect(lookup('test2.example.com')).to.be.equal('test1.example.com');

      // Cycle of three nodes
      putMappings({
        'test1.example.com': { address: 'test2.example.com', active: true },
        'test2.example.com': { address: 'test3.example.com', active: true },
        'test3.example.com': { address: 'test1.example.com', active: true },
      });
      expect(lookup('test1.example.com')).to.be.equal('test3.example.com');
      expect(lookup('test2.example.com')).to.be.equal('test1.example.com');
      expect(lookup('test3.example.com')).to.be.equal('test2.example.com');
    });
  });
});
