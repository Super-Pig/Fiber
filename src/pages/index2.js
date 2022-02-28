import React, { render, Component } from '../react'

class Greeting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: 'Garry'
    }
  }

  render() {
    return <div>
      <h1>{this.props.title}</h1>
      <h2>{this.state.name}</h2>

      <button onClick={() => this.setState({
        name: 'Peng'
      })}>Click me</button>
    </div>
  }
}

const root = document.getElementById('root')

render(<Greeting title='Garry' />, root)