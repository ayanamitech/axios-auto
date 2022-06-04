'use strict';

var PromiseAny = require('promise.any');
var assert = require('assert');
var AggregateError = require('es-aggregate-error');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PromiseAny__default = /*#__PURE__*/_interopDefaultLegacy(PromiseAny);
var AggregateError__default = /*#__PURE__*/_interopDefaultLegacy(AggregateError);

Promise.any = PromiseAny__default["default"];

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
      assert.strict.ok(err instanceof AggregateError__default["default"]);
      assert.strict.strictEqual(err.name, "AggregateError");
      assert.strict.strictEqual(err.errors[0], "ignore me");
      assert.strict.strictEqual(err.errors[1], "yes");
      assert.strict.strictEqual(err.errors[2], "nuh-uh");
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
