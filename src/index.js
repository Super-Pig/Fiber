import React, { render } from './react'

const jsx = <div>
  <p>Hello React</p>
  <span>Garry</span>
</div>

const root = document.getElementById('root')

render(jsx, root)