import { useUserContext } from "../contexts/UserContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { isLoggedIn, logoutUser, user } = useUserContext();
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const attemptLogout = async () => {
    const url = import.meta.env.VITE_SERVER_URL + "/logout";
    const data = JSON.stringify({ token: user.token });
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(url, data, headers);

      setStatus(response.data.message);

      if (
        ["Success", "Already logged out", "Invalid token"].includes(
          response.data.message
        )
      ) {
        logoutUser();
        navigate("/");
      }
    } catch (error) {
      console.log(`Tried ${url} with ${data} and ${JSON.stringify(headers)}\nError: ${error}`);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col items-center mt-6">
          <button
            onClick={() => attemptLogout()}
            className="bg-red-500 text-white p-2 rounded-md mb-4 hover:bg-red-600"
          >
            Logout
          </button>

          <p className="text-red-500">{status}</p>
        </div>
      ) : (
        <p>Already logged out</p>
      )}
    </>
  );
};

export default Logout;
