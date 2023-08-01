import React from 'react'

export default function Navbar(params) {
  const {toggleShowTask, toggleShowCategory} = params
  return (
    <>
      <nav className='navbar'>
        <p>Journal App</p>
        <button className="navbar-item" onClick={toggleShowTask}>Tasks</button>
        <button className="navbar-item" onClick={toggleShowCategory}>Categories</button>
      </nav>
    </>
  )
}
