//  options?可选参数意味着在调用函数时，这个参数可以被传入，也可以不被传入。如果不传入该参数，它的值就是 undefined。
export function effect(fn, options?) {
  // 创建一个响应式的effect，数据变化后会重新执行effect
  // 创建一个effect，只要依赖的属性变化了就要执行
  const _effect = new ReactiveEffect(fn, () => {
    // 这个
    _effect.run();
  });
  // 进来默认就执行一次
  _effect.run();
  return _effect;
}

function preCleanEffect(effect) {
  effect._depsLength = 0;
  // 每次执行id+1,如果当前effect执行的时候（同一个），id就是相同的
  effect._trackId++;
}

// 当前响应式函数
export let activeEffect;

class ReactiveEffect {
  _trackId = 0;
  deps = [];
  _depsLength = 0;
  public active = true; // 创建的effect 是响应式的

  // fn用户编写的函数
  // scheduler 用户依赖数据发生变化后，需要重新调用的函数
  // 在构造函数参数前添加 public 关键字，不但定义了公共属性，还在创建类的实例时把传入的参数值赋给了这些属性。
  constructor(public fn, public scheduler) {}
  //   让fn执行
  run() {
    if (!this.active) {
      console.log("执行了");
      return this.fn();
    }
    let lastEffect = activeEffect;
    try {
      activeEffect = this;

      // effect重新执行前，上一次依赖情况清空掉
      preCleanEffect(this);

      return this.fn(); // 依赖收集
    } finally {
      // 当依赖收集结束，则不需要这个activeEffect了
      //   只收集effect的时候的对应的函数，
      activeEffect = lastEffect;
    }
  }
}
function cleanDepEffect(dep, effect) {
  console.log(effect,'effect')
  dep.delete(effect);
  if (dep.size == 0) {
    dep.cleanup();
  }
}

export function trackEffect(effect, dep) {
  // 需要重新收集依赖
  // 第一次渲染 dep.get(effect) 一定是undefined， _trackId是1

  if (dep.get(effect) !== effect._trackId) {
    // 优化多余的收集
    dep.set(effect, effect._trackId);
    // 获取到当前的在副作用函数中最新的那个dep
    let oldDep = effect.deps[effect._depsLength];
    // 如果没有存过
    /***
     * {flag,name}
     * {flag,age}
     */
    if (oldDep !== dep) {
      // 如果老的有东西。删除老的，换成新的
      if (oldDep) {
        cleanDepEffect(oldDep, effect);
      }
      effect.deps[effect._depsLength++] = dep;
    } else {
      // 相同跳过
      effect._depsLength++;
    }
  }

  // // dep(收集器)中存入副作用函数, -----收集器和effect关联起来
  // dep.set(effect, effect._trackId);
  // // 还想要effect和收集器关联起来
  // // effect类中增加属性deps 存放当前收集器
  // effect.deps[effect._depsLength++] = dep;
}

export function triggerEffects(dep) {
  // dep.forEach((effect) => {
  //   if (effect.scheduler) {
  //     effect.scheduler();
  //   } else {
  //     effect.run();
  //   }
  // });
  // 执行副作用函数
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler();
    }
  }
}
