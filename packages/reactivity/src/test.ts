class Test {
  constructor(public fn, scheduler) {}
  run() {
    console.log(this.fn());
  }
}

function testFunction(fn, options?) {
  const testObj = new Test(fn, () => {
    console.log(testObj);
    testObj.run();
  });
  testObj.run();
  return testObj;
}

const demo = testFunction(() => console.log("测试"));
