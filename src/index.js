import React, { render, Component } from './react'

const jsx = <div>
  <p>Hello React</p>
  <span>Garry</span>
</div>

const root = document.getElementById('root')

// render(jsx, root)

// setTimeout(()=>{
//   render(<div>
//     <p>garry</p>
//   </div>, root)
// }, 2000)

class Greeting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: 'peng'
    }
  }

  render() {
    return <div>{this.props.title}
      <p>{this.state.name}</p>
      <button onClick={() => this.setState({
        name: 'nothin'
      })}>click</button>
    </div>
  }
}

render(<Greeting title='garry' />, root)

function FnComponent() {
  return <div>FnComponent</div>
}

// render(<FnComponent />, root)