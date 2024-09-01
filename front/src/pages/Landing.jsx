import React from 'react'
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='d-flex justify-content-center align-items-center w-100 vh-100'>
      <div className='d-flex flex-column align-items-center p-4' style={{ backgroundColor: '#d3d3d3', borderRadius: '8px', width: '400px' }}>
        <h1 className='font-bold mb-4'>HD WALLET</h1>
        <Link to="/login" className="btn btn-dark w-100 py-3 mb-2">Login</Link>
        <Link to="/register" className="btn btn-dark w-100 py-3">Register</Link>
      </div>
    </div>
  )
  
  
}

export default Landing