var Test = /** @class */ (function () {
  function Test(fn, scheduler) {
    this.fn = fn;
  }
  Test.prototype.run = function () {
    console.log(this.fn());
  };
  return Test;
})();
function testFunction(fn, options) {
  var testObj = new Test(fn, function () {
    console.log(111, testObj);
    testObj.run();
  });
  testObj.run();
  return testObj;
}
var demo = testFunction(function () {
  return console.log("测试");
});
setTimeout(() => {
  demo.run();
}, 1000);
