import React, { render, Component } from './react'

const jsx = <div>
  <p>Hello React</p>
  <span>Garry</span>
</div>

const root = document.getElementById('root')

// render(jsx, root)

class Greeting extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return <div>hahah</div>
  }
}

render(<Greeting />, root)