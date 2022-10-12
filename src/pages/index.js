/*
 * Copyright © 2020-2022 Ocean Galaxy Inc. All Rights Reserved.
 * @Description: 
 * @LastEditors: garry彭
 * @LastEditTime: 2022-10-12 17:35:38
 */
import React, { render, Component } from '../react'


class C extends Component {
  constructor(props) {
    super(props)

    this.state = {
      n: 0
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({
      n: this.state.n + 1
    })
  }

  render() {
    return <div>
      <h1>{this.state.n}</h1>
      <button onClick={this.handleClick}>add</button>
    </div>
  }
}

const root = document.getElementById('root')

render(<C />, root)

