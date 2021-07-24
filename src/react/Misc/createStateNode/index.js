import { createDOMElement } from "../../DOM"

const createStateNode = fiber => {
  if (fiber.tag === 'host_component') {
    // 普通节点
    return createDOMElement(fiber)
  }
}

export default createStateNode