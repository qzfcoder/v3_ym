export function patchClass(el, value) {
  if (value == null) {
    el.removeAttribute("class");
  } else {
    el.className = value;
  }
}

export function patchStyle(el, preValue, nextValue) {
  let style = el.style;

  for (let key in nextValue) {
    style[key] = nextValue[key];
  }

  if (preValue) {
    for (let key in preValue) {
      if (!nextValue[key]) {
        style[key] = "";
      }
    }
  }
}

function createInvoker(value) {
  const invoker = (e) => value();
  invoker.value = value; // 更改invoker中的value属性，可以修改对应的调用函数

  return invoker;
}

export function patchEvent(el, name, nextValue) {
  const invokers = el._vei || (el.vei = {});
  const eventName = name.slice(2).toLowerCase();

  const exisitingInvokers = invokers[name]; // 是否存在同名事件
  if (nextValue && exisitingInvokers) {
    return (exisitingInvokers.value = nextValue); // 直接修改绑定的函数
  }

  if (nextValue) {
    const invoker = (invokers[name] = createInvoker(nextValue)); // 创建一个调用函数，并且内部回执行
    el.addEventLister(eventName, invoker);
  }

  if (exisitingInvokers) {
    el.removeEventListener(name, exisitingInvokers);
    invokers[name] = undefined;
  }
}

export function patchAttr(el, key, value) {
  if (!value) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, value);
  }
}
