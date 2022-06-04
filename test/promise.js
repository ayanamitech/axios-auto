'use strict';

var assert = require('assert');

Promise.any = (values) => {
  return new Promise((resolve, reject) => {
    var _a;
    let hasResolved = false;
    const promiseLikes = [];
    let iterableCount = 0;
    const rejectionReasons = [];
    function resolveOnce(value) {
      if (!hasResolved) {
        hasResolved = true;
        resolve(value);
      }
    }
    function rejectionCheck(reason) {
      rejectionReasons.push(reason);
      if (rejectionReasons.length >= iterableCount)
        reject(rejectionReasons);
    }
    for (const value of values) {
      iterableCount++;
      promiseLikes.push(value);
    }
    for (const promiseLike of promiseLikes) {
      if ((promiseLike == null ? void 0 : promiseLike.then) !== void 0 || (promiseLike == null ? void 0 : promiseLike.catch) !== void 0) {
        (_a = promiseLike == null ? void 0 : promiseLike.then((result) => resolveOnce(result))) == null ? void 0 : _a.catch(() => void 0);
        promiseLike == null ? void 0 : promiseLike.catch((reason) => rejectionCheck(reason));
      } else
        resolveOnce(promiseLike);
    }
  });
};

function getTimedResolvingPromise(msToResolve, resolveValue) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(resolveValue), msToResolve);
  });
}
function getTimedRejectingPromise(msToReject, rejectValue) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(rejectValue), msToReject);
  });
}
describe("testing promise.any polyfill", () => {
  it("The first resolving Promise should be acted upon.", async () => {
    const promises = [
      getTimedResolvingPromise(20, "yes"),
      getTimedResolvingPromise(50, "nope"),
      getTimedResolvingPromise(65, "nuh-uh")
    ];
    assert.strict.strictEqual(await Promise.any(promises), "yes");
  });
  it("Rejecting Promises should not effect the acted-upon value so long as some Promise resolves.", async () => {
    const promises = [
      getTimedRejectingPromise(5, "ignore me"),
      getTimedRejectingPromise(50, "nuh-uh"),
      getTimedResolvingPromise(85, "yes")
    ];
    assert.strict.strictEqual(await Promise.any(promises), "yes");
  });
  it("If all Promises reject, Promise.any should reject.", async () => {
    const promises = [
      getTimedRejectingPromise(25, "ignore me"),
      getTimedRejectingPromise(50, "yes"),
      getTimedRejectingPromise(75, "nuh-uh")
    ];
    await assert.strict.rejects(async () => Promise.any(promises), (err) => {
      assert.strict.strictEqual(err[0], "ignore me");
      assert.strict.strictEqual(err[1], "yes");
      assert.strict.strictEqual(err[2], "nuh-uh");
      return true;
    });
  });
  it("Given some non-Promise items, Promise.any should return the first of these.", async () => {
    const iterable = [
      getTimedRejectingPromise(5, "ignore me"),
      getTimedResolvingPromise(50, "yes"),
      "Hello there!",
      getTimedResolvingPromise(85, "nuh-uh")
    ];
    assert.strict.strictEqual(await Promise.any(iterable), "Hello there!");
  });
});
