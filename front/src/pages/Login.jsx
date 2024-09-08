import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../service/consts";
import { FaSignInAlt } from "react-icons/fa";
import Form from "react-bootstrap/Form";

const Login = () => {
  localStorage.removeItem('auth');

  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;

    if (username.length > 0 && password.length > 0) {
      const formData = {
        username,
        password,
      };
      try {
        const response = await axios.post(
          `${baseUrl}/login`,
          formData
        );
        localStorage.setItem('auth', JSON.stringify(response.data.token));
        axios.defaults.headers.common['authorization'] = `Bearer ${response.data.token}`;
        toast.success("Login successfull");
        navigate("/home");
        // navigate("/restore");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };
  // if user already was logged in
  useEffect(() => {
    if (token !== "") {
      navigate("/home");
    }
  }, []);

  return (
    <div className="login-main d-flex justify-content-center align-items-center vh-100">
      <div className="login-right">
        <div className="login-right-container"
          style={{ width: '400px'}}>
          <div className="login-center text-center">
            <p>Login</p>
            <form onSubmit={handleLoginSubmit}>
              <input type="text" placeholder="Username" name="username" className="mb-3" />
              <div className="pass-input-div mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </div>
              <div className="login-center-buttons mb-3">
                <button className="btn btn-dark w-100 py-3">Login</button>
              </div>
            </form>
            {/* <div className="login-bottom-p"
            style={{ fontSize: '15px' }}>
              <a href="/restore" className="forgot-pass-link">
                Forgot password?
              </a>
            </div> */}
            <p className="login-bottom-p"
              style={{ fontSize: '15px' }}>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Login;
