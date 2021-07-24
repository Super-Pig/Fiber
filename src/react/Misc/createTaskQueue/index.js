const createTaskQueue = () => {
  const taskQueue = []

  return {
    /**
     * 添加任务
     * @param {*} item 
     * @returns 
     */
    push: item => taskQueue.push(item),

    /**
     * 获取任务
     * @returns 
     */
    pop: () => taskQueue.shift(),

    /**
     * 判断队列中是否还有任务
     * @returns 
     */
    isEmpty: ()=> taskQueue.length === 0
  }
}

export default createTaskQueue