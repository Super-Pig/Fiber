import { Tag } from "../../constants"
import { createDOMElement } from "../../DOM"
import { createReactInstance } from '../createReactInstance'

const createStateNode = fiber => {
  if (fiber.tag === Tag.HostComponent) {
    // 普通节点
    return createDOMElement(fiber)
  } else {
    // 类组件 or 函数组件 
    return createReactInstance(fiber)
  }
}

export default createStateNode