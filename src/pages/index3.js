import React, { render, Component } from '../react'

function FnComponent({ title }) {
  return <div>
    <h1>{title}</h1>
    <h1>Garry</h1>
  </div>
}


const root = document.getElementById('root')

render(<FnComponent title='Hello' />, root)