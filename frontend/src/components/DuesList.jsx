import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import axios from "axios";

const DuesList = ({ duesList }) => {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { user, logoutUser } = useUserContext();

  const completePayment = (amount) => {
    if (amount) {
      return "Success";
    }
    return "Success";
  };

  const attemptPayDue = async (dueDetails) => {
    if (completePayment(dueDetails.amount) !== "Success") {
      setStatus("Payment failed");
      return;
    }

    const url = import.meta.env.VITE_SERVER_URL + "/pay-due";
    const data = JSON.stringify({ token: user.token, dueDetails: dueDetails });
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
      } else if (response.data.message === "Invalid token") {
        logoutUser();
        navigate("/login");
      }
    } catch (error) {
      console.log(`Tried ${url} with ${data} and ${headers}\nError: ${error}`);
    }
  };

  const dueItem = (dueDetails, i) => {
    return (
      <div key={i}>
        <p id="billing-date">{dueDetails.billingDate}</p>
        <p id="amount">{dueDetails.amount}</p>
        <button onClick={() => attemptPayDue(dueDetails)}>Pay Due</button>
        {status}
      </div>
    );
  };

  const dues = <>{duesList.map((dueDetails, i) => dueItem(dueDetails, i))}</>;

  const noDuesMessage = <p>No dues remaining</p>;

  return <>{duesList.length === 0 ? noDuesMessage : dues}</>;
};

export default DuesList;
