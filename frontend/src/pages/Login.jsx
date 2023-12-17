import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const { isLoggedIn, loginUser } = useUserContext();
  const navigate = useNavigate();

  const loggedInMessage = <p>You are already logged in</p>;

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

  const loginForm = (
    <>
      <div>
        <label htmlFor="login-username">Username: </label>
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
        />
      </div>

      <div>
        <label htmlFor="login-password">Password: </label>
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
        />
      </div>

      <button onClick={() => attemptLogin()}>Login</button>

      <p>{status}</p>
    </>
  );

  return <>{isLoggedIn ? loggedInMessage : loginForm}</>;
};

export default Login;
