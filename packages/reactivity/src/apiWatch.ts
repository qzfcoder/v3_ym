import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref";
export function watch(source, cb, options = {} as any) {
  return doWatch(source, cb, options);
}
// 控制depth，以及当前遍历到哪一层,      seen 防止循环应用
function traverse(source, depth, currentDepth = 0, seen = new Set()) {
  if (!isObject(source)) {
    return source;
  }
  if (depth) {
    if (currentDepth >= depth) {
      return source;
    }
    currentDepth++;
  }
  if (seen.has(source)) {
    return source;
  }
  for (let key in source) {
    traverse(source[key], depth, currentDepth, seen);
  }
  return source; // 便利就会触发每个属性的getter
}

function doWatch(source, cb, { deep, immediate }) {
  // source 是需要进行用来收集
  const reactiveGetter = (source) =>
    traverse(source, deep == false ? 1 : undefined);
  // 产生一个可以给reactiveeffect来使用的getter，需要对这个对象进行取值操作，
  //会关联当前reactiveeffect
  let getter;
  if (isReactive(source)) {
    getter = () => reactiveGetter(source);
  } else if (isRef(source)) {
    getter = () => source.value;
  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;

  let clean;
  const onCleanup = (fn) => {
    clean = () => {
      fn();
      clean = undefined;
    };
  };

  const job = () => {
    if (cb) {
      let newValue = effect.run();
      if (clean) {
        clean(); //在执行回调钱，先调用上一次的清理操作进行清理
      }
      cb(oldValue, newValue, onCleanup);
      oldValue = newValue;
    } else {
      effect.run();
    }
  };
  console.log(getter, "getter");
  const effect = new ReactiveEffect(getter, job);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else {
    // watchEffect
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
  };
  return unwatch;
}

export function watchEffect(getter, options = {} as any) {
  // 没有cb 就是watcheffect
  return doWatch(getter, undefined, options);
}
