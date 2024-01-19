import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import axios from "axios";
import { useState } from "react";

const Signup = () => {
  const { isLoggedIn } = useUserContext();
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    name: "",
    username: "",
    dob: "",
    password: "",
  });

  const [status, setStatus] = useState("");

  const attemptSignup = async () => {
    const url = import.meta.env.VITE_SERVER_URL + "/signup";
    const data = JSON.stringify(signupData);
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(url, data, headers);

      setStatus(response.data.message);
      if (response.data.message === "Success") {
        navigate("/");
      }
    } catch (error) {
      console.log(`Tried ${url} with ${data} and ${JSON.stringify(headers)}\nError: ${error}`);
    }
  };

  const signupForm = (
    <div className="flex flex-col items-center mt-16">
      <div className="mb-4">
        <label htmlFor="signup-name" className="block text-gray-700">
          Name:{" "}
        </label>
        <input
          id="signup-name"
          type="text"
          value={signupData.name}
          onChange={(e) =>
            setSignupData({
              ...signupData,
              name: e.target.value,
            })
          }
          className="w-64 border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="signup-username" className="block text-gray-700">
          Username:{" "}
        </label>
        <input
          id="signup-username"
          type="text"
          value={signupData.username}
          onChange={(e) =>
            setSignupData({
              ...signupData,
              username: e.target.value,
            })
          }
          className="w-64 border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="signup-dob" className="block text-gray-700">
          Date of Birth:{" "}
        </label>
        <input
          id="signup-dob"
          type="date"
          value={signupData.dob}
          onChange={(e) =>
            setSignupData({
              ...signupData,
              dob: e.target.value,
            })
          }
          className="w-64 border border-gray-300 p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="signup-password" className="block text-gray-700">
          Password:{" "}
        </label>
        <input
          id="signup-password"
          type="password"
          value={signupData.password}
          onChange={(e) =>
            setSignupData({
              ...signupData,
              password: e.target.value,
            })
          }
          className="w-64 border border-gray-300 p-2 rounded-md"
        />
      </div>

      <button
        onClick={() => attemptSignup()}
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Signup
      </button>

      <p className="text-red-500 mt-2">{status}</p>
    </div>
  );

  const loggedInMessage = <p>You are already logged in</p>;

  return <>{isLoggedIn ? loggedInMessage : signupForm}</>;
};

export default Signup;
