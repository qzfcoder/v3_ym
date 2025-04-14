import { activeEffect } from "./effect";
import { track, trigger } from "./reactiveEffect";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

/**
 * 为什么一定要用Reflect来进行get 和set返回和设置数据
 *  因为Reflect可以返回原始值，而不会进行包装
 * // 例如
 *  const person = {
 *  name: "张三",
 *  get aliasName() {
 *      return this.name + "test";
 *  },
 *  };
 *  const proxyPerson = new Proxy(person, {
 *  get(target, key, recevier) {
 *      console.log(key);
 *      return target[key];
 *  },
 *  });
 *  // 我获取aliasName，开始获取name的值 取的是person.name,
 *  // target[key] 取值的时候，这个地方的this是指向person的，不会走代理了
 *  // recevier[key] 取值的时候， 这个时候死循环，一直在获取name
 *  // 所以需要 Reflect 来走，
 *  console.log(proxyPerson.aliasName);
 */

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // 当前的key和对应收集到的函数
    track(target, key);
    // console.log(activeEffect, key);

    // 获取值的时候，要让响应式属性和effect关联起来
    // debugger;
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    // 找到属性，让对应的effect重写执行
    let oldValue = target[key];
    let result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      // 需要出发页面更新
      trigger(target, key, oldValue, value);
    }

    // debugger;
    return result;
  },
};
