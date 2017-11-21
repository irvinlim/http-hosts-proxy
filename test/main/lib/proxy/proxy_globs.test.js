'use strict';

/* eslint-env mocha */

import { expect } from 'chai';
import proxy from '../../../../src/main/lib/proxy';

const { lookupGlob, populate, countLeaves } = proxy.globs;

describe('lib.proxy.globs', function() {
  describe('#lookupGlob', function() {
    beforeEach(function() {
      populate([]);
      expect(countLeaves()).to.be.eq(0);
    });

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

    it('should return the correct mapping if there are deeply nested globs', function() {
      populate([
        {
          hostname: '*.very.deeply.nested.test.example.com',
          address: '1.2.3.4',
        },
        { hostname: '*.example.com', address: '8.7.6.5' },
      ]);
      expect(lookupGlob('test.example.com'))
        .to.have.property('address')
        .with.equal('8.7.6.5');
      expect(lookupGlob('nested.test.example.com'))
        .to.have.property('address')
        .with.equal('8.7.6.5');
      expect(lookupGlob('deeply.nested.test.example.com'))
        .to.have.property('address')
        .with.equal('8.7.6.5');
      expect(lookupGlob('very.deeply.nested.test.example.com'))
        .to.have.property('address')
        .with.equal('8.7.6.5');
      expect(lookupGlob('one.very.deeply.nested.test.example.com'))
        .to.have.property('address')
        .with.equal('1.2.3.4');
    });
  });
});
