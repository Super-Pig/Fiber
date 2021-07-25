import React, { render, Component } from './react'

const jsx = <div>
  <p>Hello React</p>
  <span>Garry</span>
</div>

const root = document.getElementById('root')

render(jsx, root)

setTimeout(()=>{
  render(<div>
    <p>garry</p>
    <p>peng</p>
  </div>, root)
}, 2000)

class Greeting extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>hahah</div>
  }
}

// render(<Greeting />, root)

function FnComponent() {
  return <div>FnComponent</div>
}

// render(<FnComponent />, root)