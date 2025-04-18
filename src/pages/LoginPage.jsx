import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock } from "lucide-react";
import { authApi } from "@/services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("admin@example.com"); // Pre-filled for demo
  const [password, setPassword] = useState("password"); // Pre-filled for demo
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });

      if (response.data.status === "success") {
        // Set a flag in localStorage to indicate the user is logged in
        localStorage.setItem("isLoggedIn", "true");
        // Navigate to the admin dashboard
        navigate("/admin");
      } else {
        setError("Invalid login credentials");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Admin Login</h2>
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-gray-300 transition duration-300"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
          <p className="font-medium">Demo Credentials</p>
          <p className="text-sm">Email: admin@example.com</p>
          <p className="text-sm">Password: password</p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-white text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="w-full bg-white bg-opacity-20 text-white rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-3 top-3 text-white" size={20} />
            </div>
          </div>

          <div>
            <label
              className="block text-white text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="w-full bg-white bg-opacity-20 text-white rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-3 top-3 text-white" size={20} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-100 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-500 text-white rounded-lg py-2 px-4 hover:bg-gray-600 transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
