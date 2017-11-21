'use strict';

/* eslint-env mocha */

import {
  lookupGlob,
  populate,
} from '../../../../src/main/lib/proxy/proxy_globs';

import { expect } from 'chai';

describe('lib.proxy.globs', function() {
  describe('#lookupGlob', function() {
    it('should return false when the tree is empty', function() {
      expect(lookupGlob('test.example.com')).to.be.false;
    });

    it('should return false when the tree only has non-globs', function() {
      populate([
        { hostname: 'test.example.com', address: '1.2.3.4' },
        { hostname: 'test2.hello.net', address: '8.7.6.5' },
      ]);
      expect(lookupGlob('test.example.com')).to.be.false;
    });

    it('should return the correct mapping if it is contained in a single glob', function() {
      populate([
        { hostname: '*.example.com', address: '1.2.3.4' },
        { hostname: 'test2.example.com', address: '8.7.6.5' },
      ]);
      expect(lookupGlob('test.example.com'))
        .to.have.property('address')
        .with.equal('1.2.3.4');
    });

    it('should return false if it is not contained in any glob', function() {
      populate([
        { hostname: '*.example.com', address: '1.2.3.4' },
        { hostname: '*.mysite.net', address: '8.7.6.5' },
      ]);
      expect(lookupGlob('neopets.com')).to.be.false;
    });

    it('should return false if it exactly matches any glob', function() {
      populate([
        { hostname: '*.example.com', address: '1.2.3.4' },
        { hostname: 'test2.example.com', address: '8.7.6.5' },
      ]);
      expect(lookupGlob('example.com')).to.be.false;
    });

    it('should return the correct mapping if it is contained in the most specific glob', function() {
      populate([
        { hostname: '*.test.example.com', address: '1.2.3.4' },
        { hostname: '*.example.com', address: '8.7.6.5' },
      ]);
      expect(lookupGlob('hello.test.example.com'))
        .to.have.property('address')
        .with.equal('1.2.3.4');
    });

    it('should return the correct mapping if the matched glob is contained in another glob', function() {
      populate([
        { hostname: '*.test.example.com', address: '1.2.3.4' },
        { hostname: '*.example.com', address: '8.7.6.5' },
      ]);
      expect(lookupGlob('hello.example.com'))
        .to.have.property('address')
        .with.equal('8.7.6.5');
    });

    it('should return the correct mapping if there are nested globs', function() {
      populate([
        { hostname: '*.test.example.com', address: '1.2.3.4' },
        { hostname: '*.example.com', address: '8.7.6.5' },
      ]);
      expect(lookupGlob('test.example.com'))
        .to.have.property('address')
        .with.equal('8.7.6.5');
    });
  });
});
