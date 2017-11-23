'use strict';

/* eslint-env mocha */

import {
  getMapping,
  getMappings,
  putMappings,
} from '../../../../src/main/lib/proxy/proxy_storage';

import { expect } from 'chai';

describe('lib.proxy.storage', function() {
  describe('#putMappings', function() {
    beforeEach(function() {
      putMappings({});
      expect(getMappings()).to.be.empty;
    });

    it('should be saved and returned in the correct format', function() {
      putMappings({
        'test.example.com': {
          address: '1.2.3.4',
          active: true,
          hostHeader: 'test.example.com',
        },
      });

      expect(getMappings()).to.be.deep.equal({
        'test.example.com': {
          address: '1.2.3.4',
          active: true,
          hostHeader: 'test.example.com',
        },
      });
    });
  });

  describe('#getMapping', function() {
    beforeEach(function() {
      putMappings({});
      expect(getMappings()).to.be.empty;
    });

    it('should be retrieved in the correct format', function() {
      putMappings({
        'test.example.com': {
          address: '1.2.3.4',
          active: true,
          hostHeader: 'test.example.com',
        },
      });
      expect(getMapping('test.example.com')).to.be.deep.equal({
        address: '1.2.3.4',
        active: true,
        hostHeader: 'test.example.com',
      });
    });
  });
});
