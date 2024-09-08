import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../service/consts";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState(""); // State to store seed phrase
  const [showSeedPhrase, setShowSeedPhrase] = useState(false); // State to toggle seed phrase display
  const navigate = useNavigate();
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let username = e.target.username.value;
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;

    if (username.length > 0 && password.length > 0 && confirmPassword.length > 0) {
      if (password === confirmPassword) {
        const formData = {
          username,
          password
        };
        try {
          const response = await axios.post(`${baseUrl}/register`, formData);
          console.log(response);
          toast.success("Registration successful!");
          setSeedPhrase(response.data.person.seedPhrase); // Set seed phrase from response
          setShowSeedPhrase(true); // Show seed phrase
          
          setTimeout(() => {
            setShowSeedPhrase(false);
            navigate("/login");
          }, 60000);

        } catch (err) {
          toast.error(err.message);
        }
      } else {
        toast.error("Passwords don't match");
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    if (token !== "") {
      toast.success("You are already logged in");
      navigate("/home");
    }
  }, [token, navigate]);

  return (
    <div className="register-main">
      <div className="register-right">
        <div className="register-right-container d-flex justify-content-center align-items-center vh-100">
          <div className="register-center" style={{ width: '400px' }}>
            <p>Register</p>
            <form onSubmit={handleRegisterSubmit}>
              <input type="text" placeholder="Username" name="username" required />

              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div>
                <button type="submit" className="btn btn-dark w-100 py-3 mt-4">
                  Register
                </button>
              </div>
            </form>

            {/* Seed Phrase Display */}
            {showSeedPhrase && (
              <div className="mt-4 alert alert-info">
                <h6>Write this down.<br/>You'll be redirected in 1 minute to login.</h6>
                <h5>Your Seed Phrase:</h5>
                <p>{seedPhrase}</p>
              </div>
            )}

            <p className="register-bottom-p mt-4" style={{ fontSize: '15px' }}>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
