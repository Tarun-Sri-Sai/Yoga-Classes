import { useState } from "react";

const EnrollForm = ({ user }) => {
  const [status, setStatus] = useState("");

  const [timings, setTimings] = useState("");

  const completePayment = () => {
    return "Success";
  };

  const attemptEnroll = async () => {
    if (completePayment() !== "Success") {
      setStatus("Payment Failed");
      return;
    }

    const url = import.meta.env.VITE_SERVER_URL + "/enroll";
    const response = await axios.post(
      url,
      JSON.stringify({ timings: timings })
    );

    if (response.data.message === "Success") {
      navigate("/");
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

      <button onClick={() => attemptEnroll()}>Pay</button>
      {status}
    </>
  );
};

export default EnrollForm;
