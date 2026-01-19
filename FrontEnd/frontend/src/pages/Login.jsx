import { useState } from "react";
import api from "../api/axios";
import { useLocation, useNavigate} from "react-router-dom"; // 1. Import useNavigate
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate(); // 2. Initialize it

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("login/", { username, password });
      alert("Login Successful!");
      toast.success("Login Successful!");
      

      // 3. Redirect to the invoices page after success
      navigate("/invoices"); 

      window.location.reload(); // Refresh to update auth state
    } catch (err) {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input 
          className="form-control mb-2" 
          placeholder="Username" 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          className="form-control mb-2" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="btn btn-primary w-100">Sign In</button>
        <p className="text-center mt-3 small">
        Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;