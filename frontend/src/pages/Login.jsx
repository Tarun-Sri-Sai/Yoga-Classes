import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const { isLoggedIn, loginUser } = useUserContext();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [status, setStatus] = useState("");

  const attemptLogin = async () => {
    const url = import.meta.env.VITE_SERVER_URL + "/login";
    const data = JSON.stringify(loginData);
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(url, data, headers);

      setStatus(response.data.message);

      if (response.data.message === "Success") {
        loginUser(response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.log(`Tried ${url} with ${data} and ${headers}\nError: ${error}`);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <p>You are already logged in</p>
      ) : (
        <div className="flex flex-col items-center mt-16">
          <div className="mb-4">
            <label htmlFor="login-username" className="block text-gray-700">
              Username:{" "}
            </label>
            <input
              id="login-username"
              type="text"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  username: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="login-password" className="block text-gray-700">
              Password:{" "}
            </label>
            <input
              id="login-password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>

          <button
            onClick={() => attemptLogin()}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>

          <p className="text-red-500 mt-2">{status}</p>
        </div>
      )}
    </>
  );
};

export default Login;
