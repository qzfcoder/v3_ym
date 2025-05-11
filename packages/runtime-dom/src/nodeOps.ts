// 主要是对节点元素的增删改查
export const nodeOps = {
  // anchor  目标元素  如果anchor为null，则插入到parent的末尾 等于appendChild
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
  // 删除元素
  remove(el) {
    const parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
  },
  // 暂时不考虑， 后续处理
  patchProp(el, key, prevValue, nextValue) {},
  // 创建元素
  createElement(type) {
    return document.createElement(type);
  },
  // 创建文本
  createText(text) {
    return document.createTextNode(text);
  },
  setText(el, text) {
    el.textContent = text;
  },
  // 设置元素的文本
  setElementText(el, text) {
    el.textContent = text;
  },
  // 获取父元素
  parentNode(el) {
    return el.parentNode;
  },
  // 获取兄弟元素
  nextSibling(el) {
    return el.nextSibling;
  },
  // 获取元素的标签名
  tagName(el) {
    return el.tagName;
  },
};
