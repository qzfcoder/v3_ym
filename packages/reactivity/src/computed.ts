import { isFunction } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";

class ComputedRefImpl {
  // 老的值
  _value;
  public effect;
  public dep;
  constructor(getter, public setter) {
    // 需要创建一个effect来关联当前计算属性
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        // 当前计算属性依赖的值变化，应该触发渲染
        triggerRefValue(this); // 依赖属性变化后，要更新数据
      }
    );
  }

  get value() {
    // 需要额外处理，
    if (this.effect.dirty) {
      this._value = this.effect.run();
      // 如果在effect中访问了计算属性，计算属性是可以收集这个effect的
      trackRefValue(this);
    }
    return this._value;
  }
  set value(v) {
    this.setter(v);
  }
}

export function computed(getterOrOptions) {
  let onlyGetter = isFunction(getterOrOptions);
  let getter;
  let setter;
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {};
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  console.log(getter, setter);

  return new ComputedRefImpl(getter, setter);
}
