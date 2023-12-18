import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const EnrollForm = ({ onSubmit, updated }) => {
  const [status, setStatus] = useState("");
  const [timings, setTimings] = useState("");
  const navigate = useNavigate();
  const { user, logoutUser } = useUserContext();

  useEffect(() => setStatus(""), [updated]);

  const getCurrentDate = () => {
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

    return `${currentYear}-${currentMonth}`;
  };

  const attemptEnroll = async () => {
    const url = import.meta.env.VITE_SERVER_URL + "/enroll";
    const data = JSON.stringify({
      token: user.token,
      timings: timings,
      date: getCurrentDate(),
    });
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

      <button onClick={() => attemptEnroll()}>Enroll</button>
      {status}
    </>
  );
};

export default EnrollForm;
