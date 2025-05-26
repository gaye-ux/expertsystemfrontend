import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { FcGoogle } from "react-icons/fc"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login success:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto shadow-md bg-white rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
      <input
        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition duration-300 mb-3"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded font-semibold transition duration-300 hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-400 hover:text-white shadow-sm"
onClick={handleGoogleLogin}
      >
        <FcGoogle className="text-xl" />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
