'use strict';

/* eslint-env mocha */

import { expect } from 'chai';
import { loadFromStorage } from '../../../../src/main/lib/proxy/proxy_storage';
import { lookup } from '../../../../src/main/lib/proxy/proxy_lookup';

describe('lib.proxy.lookup', function() {
  describe('#lookup', function() {
    it('should return the same hostname when there are no mappings', function() {
      loadFromStorage();
      expect(lookup('test.example.com')).to.be.equal('test.example.com');
    });
  });
});
