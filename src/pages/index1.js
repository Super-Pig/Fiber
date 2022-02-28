import React, { render } from '../react'

const jsx = <div>
  <p>Hello React</p>
  <p>Hello Garry</p>
</div>

const root = document.getElementById('root')

render(jsx, root)

setTimeout(() => {
  const jsx = <div>
    <p>Hello Garry</p>
  </div>

  render(jsx, root)
}, 2000)