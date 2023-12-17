import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import axios from 'axios'
import { useState } from "react";

const Signup = () => {
  const { isLoggedIn } = useUserContext();
  const navigate = useNavigate()

  const loggedInMessage = <p>You are already logged in</p>;

  const [signupData, setSignupData] = useState({
    name: "",
    username: "",
    dob: "",
    password: ""
  })

  const [ status, setStatus ] = useState("")

  const attemptSignup = async () => {
    const url = import.meta.env.VITE_SERVER_URL + "/signup"
    const response = await axios.post(url, signupData)
    
    setStatus(response.data.message)
    if (response.data.message === 'Success') {
      navigate("/")
    }
  }

  const signupForm = (
    <>
      <div>
        <label htmlFor="signup-name">Name: </label>
        <input id="signup-name" type="text" value={signupData.name} onChange={(e) => setSignupData({
          ...signupData,
          name: e.target.value
        })} />
      </div>

      <div>
        <label htmlFor="signup-username">Username: </label>
        <input id="signup-username" type="text" value={signupData.username} onChange={(e) => setSignupData({
          ...signupData,
          username: e.target.value
        })} />
      </div>

      <div>
        <label htmlFor="signup-dob">Date of Birth: </label>
        <input id="signup-dob" type="date" value={signupData.dob} onChange={(e) => setSignupData({
          ...signupData,
          dob: e.target.value
        })} />
      </div>

      <div>
      <label htmlFor="signup-password">Password: </label>
        <input id="signup-password" type="password" value={signupData.password} onChange={(e) => setSignupData({
          ...signupData,
          password: e.target.value
        })} />
      </div>

      <button onClick={() => attemptSignup()}>Signup</button>
      
      <p>{status}</p>
    </>
  );

  return <>{isLoggedIn ? loggedInMessage : signupForm}</>;
};

export default Signup;
