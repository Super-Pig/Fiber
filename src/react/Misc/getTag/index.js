import Component from "../../component"
import { Tag } from "../../constants"

const getTag = vdom => {
  if (typeof vdom.type === 'string') {
    // 普通节点
    return Tag.HostComponent
  } else if (Object.getPrototypeOf(vdom.type) === Component) {
    // 类组件
    return Tag.ClassComponent
  } else {
    // 函数组件
    return Tag.FunctionComponent
  }
}

export default getTag