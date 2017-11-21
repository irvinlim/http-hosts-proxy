'use strict';

/* eslint-env mocha */

import {
  getMappings,
  putMappings,
} from '../../../../src/main/lib/proxy/proxy_storage';

import { countLeaves } from '../../../../src/main/lib/proxy/proxy_globs';
import { expect } from 'chai';
import { lookup } from '../../../../src/main/lib/proxy/proxy_lookup';

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
        'test.example.com': '1.2.3.4',
        'hello.mysite.net': '5.6.7.8',
      });
      expect(lookup('mycompany.xyz')).to.be.equal('mycompany.xyz');
    });

    it('should return a resolved address when a hostname exactly matches', function() {
      putMappings({
        'test.example.com': '1.2.3.4',
        'hello.mysite.net': '5.6.7.8',
      });
      expect(lookup('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('hello.mysite.net')).to.be.equal('5.6.7.8');
    });

    it('should recursively resolve addresses stored in the mappings', function() {
      putMappings({
        'test.example.com': 'hello.mysite.net',
        'hello.mysite.net': '5.6.7.8',
      });
      expect(lookup('hello.mysite.net')).to.be.equal('5.6.7.8');
      expect(lookup('test.example.com')).to.be.equal('5.6.7.8');
    });

    it('should resolve glob hostnames correctly', function() {
      putMappings({
        '*.example.com': '1.2.3.4',
        'hello.mysite.net': '5.6.7.8',
      });
      expect(lookup('example.com')).to.be.equal('example.com');
      expect(lookup('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('another.test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('yet.another.test.example.com')).to.be.equal('1.2.3.4');
    });

    it('should resolve nested glob hostnames correctly', function() {
      putMappings({
        '*.test.example.com': '1.2.3.4',
        '*.example.com': '5.6.7.8',
      });
      expect(lookup('example.com')).to.be.equal('example.com');
      expect(lookup('test.example.com')).to.be.equal('5.6.7.8');
      expect(lookup('another.test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('yet.another.test.example.com')).to.be.equal('1.2.3.4');
    });

    it('should resolve absolute hostnames before glob hostnames', function() {
      putMappings({
        '*.example.com': '5.6.7.8',
        'test.example.com': '1.2.3.4',
      });
      expect(lookup('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('test2.example.com')).to.be.equal('5.6.7.8');
    });

    it('should recursively resolve glob hostnames into absolute hostnames', function() {
      putMappings({
        '*.example.com': 'test.example.com',
        'test.example.com': '1.2.3.4',
      });
      expect(lookup('example.com')).to.be.equal('example.com');
      expect(lookup('test.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('test2.example.com')).to.be.equal('1.2.3.4');
      expect(lookup('test3.test.example.com')).to.be.equal('1.2.3.4');
    });
  });
});
