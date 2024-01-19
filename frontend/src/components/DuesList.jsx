import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import axios from "axios";

const DuesList = ({ duesList, onSubmit, updated }) => {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { user, logoutUser } = useUserContext();

  useEffect(() => setStatus(""), [updated]);

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
        onSubmit();
        navigate("/");
      } else if (response.data.message === "Invalid token") {
        logoutUser();
        navigate("/login");
      }
    } catch (error) {
      console.log(
        `Tried ${url} with ${data} and ${JSON.stringify(
          headers
        )}\nError: ${error}`
      );
    }
  };

  return (
    <>
      {duesList.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white p-6 rounded-md shadow-md mb-4">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              No dues remaining
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-md shadow-md mb-4">
          {duesList.map((dueDetails, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-md shadow-md mb-4 flex items-center justify-between"
            >
              <div>
                <p className="text-lg font-semibold" id="billing-date">
                  {dueDetails.date}
                </p>
                <p className="text-gray-600" id="amount">
                  Rs. {dueDetails.amount}
                </p>
              </div>

              <div>
                <button
                  onClick={() => attemptPayDue(dueDetails)}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 ml-4"
                >
                  Pay Due
                </button>
              </div>

              <p className="text-red-500 ml-4">{status}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DuesList;
