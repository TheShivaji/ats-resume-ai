import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import '../Style/form.scss'
const Signup = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
      await signup(formData);
      
    
    
  };
  return (

    <main>
      <div className="form-container">
        <div className="form-header">
          <h1>Create Account</h1>
          <p>Join us and start your journey</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? <span className="btn-loader" /> : "Sign Up"}
          </button>
        </form>
        <div className="form-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Signup
