import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import { useState } from "react";

const Login = () => {
  const { isLoggedIn, loginUser } = useUserContext();
  const navigate = useNavigate();

  const loggedInMessage = <p>You are already logged in</p>;

  const [loginData, setLoginData] = useState({
    name: "",
    username: "",
    dob: "",
    password: "",
  });

  const [status, setStatus] = useState("");

  const attemptLogin = async () => {
    const url = import.meta.env.VITE_SERVER_URL + "/login";
    const response = await axios.post(url, loginData);

    setStatus(response.data.message);

    if (response.data.message === "Success") {
      loginUser(response.data.token);
      navigate("/");
    } else if (response.data.message === 'Logged out') {
      logoutUser()
      navigate("/login")
    }
  };

  const loginForm = (
    <>
      <div>
        <label htmlFor="signup-username">Username: </label>
        <input
          id="signup-username"
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
        <label htmlFor="signup-password">Password: </label>
        <input
          id="signup-password"
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

      <button onClick={() => attemptLogin()}>Signup</button>

      <p>{status}</p>
    </>
  );

  return <>{isLoggedIn ? loggedInMessage : loginForm}</>;
};

export default Login;
