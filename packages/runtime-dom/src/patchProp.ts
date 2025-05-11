// 主要对节点元素的属性进行处理

import {
  patchClass,
  patchStyle,
  patchEvent,
  patchAttr,
} from "./modules/patchClass";

export default function patchProp(el, key, prevValue, nextValue) {
  if (key == "class") {
    return patchClass(el, nextValue);
  } else if (key == "style") {
    return patchStyle(el, prevValue, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    return patchEvent(el, key, nextValue);
  } else {
    return patchAttr(el, key, nextValue);
  }
}
