import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandler";
import { ReactiveFlags } from "./constance";

// 用于记录代理后的结果，防止同一个对象多次进行代理
const reactiveMap = new WeakMap();

function createReactiveObject(target) {
  // 判断是否是一个对象
  if (!isObject(target)) {
    return;
  }
  // 如果是，就创建一个响应式对象
  // mutableHandles 是一个处理器，处理get set方法等
  const exitsProxy = reactiveMap.get(target);
  // 若存在，则直接返回代理后的对象
  if (exitsProxy) {
    return exitsProxy;
  }
  // 如果存在这个属性，则返回代理对象直接返回target
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  let proxy = new Proxy(target, mutableHandlers);

  // 把对象和缓存结果进行缓存
  reactiveMap.set(target, proxy);

  // 返回一个代理对象
  return proxy;
}

export function reactive(target) {
  return createReactiveObject(target);
}

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}
