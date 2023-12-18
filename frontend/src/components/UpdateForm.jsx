import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const UpdateForm = ({ onSubmit, updated }) => {
  const [timings, setTimings] = useState("");
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const { user, logoutUser } = useUserContext();

  useEffect(() => setStatus(""), [updated]);

  const attemptUpdate = async () => {
    const url = import.meta.env.VITE_SERVER_URL + "/update";
    const data = JSON.stringify({ token: user.token, timings: timings });
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(url, data, headers);

      setStatus(response.data.message);
      if (response.data.message === "Success") {
        onSubmit();
        navigate("/");
      } else if (response.data.message === "Invalid token") {
        logoutUser();
        navigate("/login");
      }
    } catch (error) {
      console.log(`Tried ${url} with ${data} and ${headers}\nError: ${error}`);
    }
  };

  return (
    <>
      <label htmlFor="enroll-time-slot">Time slot: </label>

      <select
        id="enroll-time-slot"
        value={timings}
        onChange={(e) => setTimings(e.target.value)}
      >
        <option value="">Select an option</option>
        <option value="0">6 to 7</option>
        <option value="1">7 to 8</option>
        <option value="2">8 to 9</option>
        <option value="3">5 to 6</option>
      </select>

      <button onClick={() => attemptUpdate()}>Update Timings</button>

      {status}
    </>
  );
};

export default UpdateForm;
