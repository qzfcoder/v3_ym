/***
 * 这种进行收集
 *  {name:1,age:1}
 *  {
 *      name:{
 *          effects:[fn1,fn2]
 *      }
 *       age:{
 *          effects:[fn1,fn2]
 *      }
 *  }
 */

import { activeEffect, trackEffect, triggerEffects } from "./effect";

// 存放依赖收集的关系
const targetMap = new WeakMap();

// 增加删除操作,可以删除当前map
export const createDep = (cleanup, key) => {
  let dep = new Map() as any;
  dep.cleanup = cleanup;
  dep.key = key;
  return dep;
};

// 对对应的key和函数进行收集
export function track(target, key) {
  //   activeEffect 有这个属性说明，当前存在副作用函数，需要被收集
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = createDep(() => depsMap.delete(), key)));
    }
    // 将当前的effect放入到dep中, 后续值发生变化,触发方法执行
    trackEffect(activeEffect, dep);
    console.log("targetMap", targetMap);
  }
}

export function trigger(target, key, oldValue, newValue) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  if (!dep) {
    return;
  }
  // 如果dep有值，则触发更新
  triggerEffects(dep);
}
