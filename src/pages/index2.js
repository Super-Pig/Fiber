import React, { render, Component } from '../react'

class Greeting extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>
      <h1>{this.props.title}</h1>
    </div>
  }
}

const root = document.getElementById('root')

render(<Greeting title='Garry' />, root)