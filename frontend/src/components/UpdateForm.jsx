import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const UpdateForm = ({ onSubmit, updated, timeSlots }) => {
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
    <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
      <label htmlFor="enroll-time-slot" className="mb-2 text-lg">
        Time slot:
      </label>

      <select
        id="enroll-time-slot"
        value={timings}
        onChange={(e) => setTimings(e.target.value)}
        className="border border-gray-300 p-2 rounded-md mb-4"
      >
        <option value="">Select an option</option>
        <option value="0">{timeSlots.get("0")}</option>
        <option value="1">{timeSlots.get("1")}</option>
        <option value="2">{timeSlots.get("2")}</option>
        <option value="3">{timeSlots.get("3")}</option>
      </select>

      <button
        onClick={() => attemptUpdate()}
        className="bg-blue-500 text-white p-2 rounded-md mb-4 hover:bg-blue-600"
      >
        Update Timings
      </button>

      <p className="text-red-500 mb-4">{status}</p>
    </div>
  );
};

export default UpdateForm;
