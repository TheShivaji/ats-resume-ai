import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
const {login , isLoading , error} = useAuthStore();
const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    
  };
  return (
    <main>
      <div className="form-container">
        <div className="form-header">
          <h1>Welcome Back</h1>
          <p>Login to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
          </button>
        </form>
        <div className="form-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Login