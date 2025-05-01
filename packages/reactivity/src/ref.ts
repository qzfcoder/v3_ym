import { activeEffect, trackEffect, triggerEffects } from "./effect";
import { toReactive } from "./reactive";
import { createDep } from "./reactiveEffect";
/***
 * ref 中可能是对象形式的
 */
export function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}

class RefImpl {
  public __v_isRef = true; // 增加ref表示
  public _value; // 用来保存ref的值的

  public dep; // 收集对应的effect
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if ((this.rawValue! = newValue)) {
      this.rawValue = newValue;
      this._value = this.rawValue;
      triggerRefValue(this);
    }
  }
}

export function trackRefValue(ref) {
  if (activeEffect) {
    trackEffect(
      activeEffect,
      (ref.dep = createDep(() => (ref.dep = undefined), undefined))
    );
  }
}
export function triggerRefValue(ref) {
  let dep = ref.dep;
  if (dep) {
    // 触发依赖更新
    triggerEffects(dep);
  }
}

// toRef， toRefs
class ObjectRefImpl {
  public __v_isRef = true; // 增加ref表示
  constructor(public _object, public _key) {}

  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}
export function toRefs(object) {
  // 不考虑数组格式的
  const res = {};

  for (let key in object) {
    res[key] = toRef(object, key);
  }
  return res;
}

export function proxyRefs(objectWithRef) {
  return new Proxy(objectWithRef, {
    get(target, key, receiver) {
      let r = Reflect.get(target, key, receiver);
      if (r.__v_isRef) {
        return r.value;
      } else {
        return r;
      }
    },
    set(target, key, value, receiver) {
      let oldValue = target[value];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    },
  });
}
