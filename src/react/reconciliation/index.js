import { createTaskQueue, arrified, createStateNode, getTag, getRoot } from "../Misc"
import { EffectTag, Tag } from '../constants'
import { updateNodeElement } from "../DOM"

const taskQueue = createTaskQueue()
let subTask = null
let pendingCommit = null

const commitAllWork = fiber => {
  fiber.effects.forEach(item => {
    if (item.tag === Tag.ClassComponent) {
      item.stateNode.__fiber = item
    }

    if (item.effectTag === EffectTag.Delete) {
      item.parent.stateNode.removeChild(item.stateNode)
    } else if (item.effectTag === EffectTag.Update) {
      // 更新
      if (item.type === item.alternate.type) {
        // 节点类型相同
        updateNodeElement(item.stateNode, item, item.alternate)
      } else {
        // 节点类型不同
        item.parent.stateNode.replaceChild(item.stateNode, item.alternate.stateNode)
      }
    } else if (item.effectTag === EffectTag.Placement) {
      let fiber = item
      let parentFiber = item.parent

      while (parentFiber.tag === Tag.ClassComponent || parentFiber.tag === Tag.FunctionComponent) {
        parentFiber = parentFiber.parent
      }

      if (fiber.tag === Tag.HostComponent) {
        parentFiber.stateNode.appendChild(fiber.stateNode)
      }
    }
  })

  // 备份旧的 fiber 节点对象
  fiber.stateNode.__rootFiberContainer = fiber
}

const getFirstTask = () => {
  // 从任务队列中获取任务
  const task = taskQueue.pop()

  if (task.from === Tag.ClassComponent) {
    const root = getRoot(task.instance)

    task.instance.__fiber.partialState = task.partialState

    return {
      props: root.props,
      stateNode: root.stateNode,
      tag: Tag.HostRoot,
      effects: [],
      child: null,
      alternate: root
    }
  }

  // 返回最外层节点的 fiber 对象
  return {
    props: task.props,
    stateNode: task.dom,
    tag: Tag.HostRoot,
    effects: [],
    child: null,
    alternate: task.dom.__rootFiberContainer
  }
}

const reconcileChildren = (fiber, children) => {
  // children 可能是对象，也可能是数组
  // 将 children 转换成数组
  const arrifiedChildren = arrified(children)

  let index = 0
  let numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let prevFiber = null
  let alternate = null

  if (fiber.alternate && fiber.alternate.child) {
    alternate = fiber.alternate.child
  }

  while (index < numberOfElements || alternate) {
    element = arrifiedChildren[index]

    if (!element && alternate) {
      // 删除
      alternate.effectTag = EffectTag.Delete
      fiber.effects.push(alternate)
    } else if (element && alternate) {
      // 更新
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element),
        effects: [],
        effectTag: EffectTag.Update,
        stateNode: null,
        parent: fiber,
        alternate
      }

      if (element.type === alternate.type) {
        // 类型相同
        newFiber.stateNode = alternate.stateNode
      } else {
        // 类型不同
        newFiber.stateNode = createStateNode(newFiber)
      }
    } else if (element && !alternate) {
      // 初始渲染
      newFiber = {
        type: element.type,
        props: element.props,
        tag: getTag(element),
        effects: [],
        effectTag: EffectTag.Placement,
        stateNode: null,
        parent: fiber
      }

      newFiber.stateNode = createStateNode(newFiber)
    }

    // 为父级 fiber 添加子级 fiber
    if (index === 0) {
      fiber.child = newFiber
    } else if (element) {
      // 为 fiber 添加下一个兄弟 fiber
      prevFiber.sibling = newFiber
    }

    if (alternate && alternate.sibling) {
      alternate = alternate.sibling
    } else {
      alternate = null
    }

    prevFiber = newFiber

    index++
  }
}

const executeTask = fiber => {
  // 构建子级 fiber 对象
  if (fiber.tag === Tag.ClassComponent) {
    if (fiber.stateNode.__fiber && fiber.stateNode.__fiber.partialState) {
      fiber.stateNode.state = {
        ...fiber.stateNode.state,
        ...fiber.stateNode.__fiber.partialState
      }
    }

    reconcileChildren(fiber, fiber.stateNode.render())
  } else if (fiber.tag === Tag.FunctionComponent) {
    reconcileChildren(fiber, fiber.stateNode(fiber.props))
  } else {
    reconcileChildren(fiber, fiber.props.children)
  }

  if (fiber.child) {
    return fiber.child
  }

  let currentExecutelyFiber = fiber

  while (currentExecutelyFiber.parent) {
    currentExecutelyFiber.parent.effects = currentExecutelyFiber.parent.effects.concat(
      currentExecutelyFiber.effects.concat([currentExecutelyFiber])
    )

    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }

    currentExecutelyFiber = currentExecutelyFiber.parent
  }

  pendingCommit = currentExecutelyFiber
}

const workloop = deadline => {
  // 如果子任务不存在，就去获取子任务
  if (!subTask) {
    subTask = getFirstTask()
  }

  // 如果任务存在并且浏览器有空余时间就调用 executeTask 方法执行任务
  while (subTask && deadline.timeRemaining() > 1) {
    subTask = executeTask(subTask)
  }

  if (pendingCommit) {
    commitAllWork(pendingCommit)

    pendingCommit = null
  }
}

const performTask = deadline => {
  // 执行任务
  workloop(deadline)

  // 判断任务是否存在
  // 判断队列中是否还有任务没有执行
  // 再一次告诉浏览器在空闲的时间执行任务
  if (subTask || !taskQueue.isEmpty()) {
    requestIdleCallback(performTask)
  }
}

export const render = (element, dom) => {
  /**
   * 1. 向任务队列中添加任务
   * 2. 指定在浏览器空闲时执行任务
   */

  /**
   * 任务就是通过 virtualDOM 对象创建 fiber 对象
   */
  taskQueue.push({
    dom,
    props: {
      children: element
    }
  })

  requestIdleCallback(performTask)
}

export const scheduleUpdate = (instance, partialState) => {
  taskQueue.push({
    from: Tag.ClassComponent,
    instance,
    partialState
  })

  requestIdleCallback(performTask)
}