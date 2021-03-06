import assert from 'power-assert';
import { spy } from 'sinon';

import { createSession, makeRequest, makeUrl } from './';

describe('API: Utilities', () => {
  describe('makeUrl', () => {
    it('constructs a URL including provided path', () => {
      const result = makeUrl('great');
      assert.equal(
        result,
        'http://api.skyscanner.net/apiservices/pricing/v1.0/great?apikey=123'
      );
    });

    it('constructs a URL without a provided path', () => {
      const result = makeUrl(null);
      assert.equal(
        result,
        'http://api.skyscanner.net/apiservices/pricing/v1.0/?apikey=123'
      );
    });
  });

  describe('makeRequest', () => {
    it('creates a request against the provided endpoint', () => {
      const expectedData = { something: 'naughty' };
      const fetch = spy(() => Promise.resolve({ ok: true }));

      return new Promise((resolve, reject) => {
        makeRequest({ nice: 'wahey' })(
          'http://www.bbc.co.uk/hello',
          fetch
        ).fork(reject, data => {
          assert.ok(
            fetch.calledWith('http://www.bbc.co.uk/hello', { nice: 'wahey' })
          );
          resolve();
        });
      });
    });

    describe('Resolves', () => {
      it('200 - 299 range', () => {
        const expectedData = { something: 'naughty' };
        const fetch = spy(() => Promise.resolve({ ok: true }));

        return new Promise((resolve, reject) => {
          makeRequest({ nice: 'wahey' })(
            'http://www.bbc.co.uk/hello',
            fetch
          ).fork(reject, data => {
            assert.ok(
              fetch.calledWith('http://www.bbc.co.uk/hello', { nice: 'wahey' })
            );
            resolve();
          });
        });
      });

      it('304 range', () => {
        const expectedData = { something: 'naughty' };
        const fetch = spy(() => Promise.resolve({ status: 304 }));

        return new Promise((resolve, reject) => {
          makeRequest({ nice: 'wahey' })(
            'http://www.bbc.co.uk/hello',
            fetch
          ).fork(reject, data => {
            assert.ok(
              fetch.calledWith('http://www.bbc.co.uk/hello', { nice: 'wahey' })
            );
            resolve();
          });
        });
      });
    });

    describe('Rejects', () => {
      it("rejects if the result doesn't include a successful status", () => {
        const fetch = spy(() => Promise.resolve({ ok: false, status: 404 }));

        return new Promise((resolve, reject) => {
          makeRequest()('http://www.bbc.co.uk/hello', fetch).fork(
            err => {
              assert.ok(err instanceof Error);
              assert.deepEqual(err.config, {
                status: 404,
                url: 'http://www.bbc.co.uk/hello'
              });
              resolve();
            },
            reject
          );
        });
      });
    });
  });
});
