import { useUserContext } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import EnrollForm from "../components/EnrollForm";
import DuesList from "../components/DuesList";
import UpdateForm from "../components/UpdateForm";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isLoggedIn, user, logoutUser } = useUserContext();
  const navigate = useNavigate();
  const [updated, setUpdated] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    timeSlot: "",
    isEnrolled: false,
    duesList: [],
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (!isLoggedIn) {
        return;
      }

      const url = import.meta.env.VITE_SERVER_URL + "/user-details";
      const headers = {
        headers: {
          "Content-Type": "application/json",
          token: user.token,
        },
      };

      try {
        const response = await axios.get(url, headers);

        if (response.data.message === "Success") {
          setUserDetails(response.data.userDetails);
        } else if (response.data.message === "Invalid token") {
          logoutUser();
          navigate("/login");
        }
      } catch (error) {
        console.log(
          `Tried ${url} with ${JSON.stringify(headers)}\nError: ${error}`
        );
      }
    };

    fetchDetails();
    setUpdated(false);
  }, [isLoggedIn, updated]);

  const timings = new Map([
    ["0", "6 to 7 AM"],
    ["1", "7 to 8 AM"],
    ["2", "8 to 9 AM"],
    ["3", "5 to 6 PM"],
  ]);

  const formProps = {
    onSubmit: () => setUpdated(true),
    updated: updated,
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <div>
            <p className="text-2xl font-bold text-center text-gray-800 mt-8">
              Welcome <span className="text-blue-500">{userDetails.name}</span>
            </p>
          </div>
          <div>
            {userDetails.isEnrolled ? (
              <>
                <div>
                  <p className="text-lg font-semibold text-center text-blue-700">
                    You are enrolled in {timings.get(userDetails.timeSlot)}
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="mr-4">
                    <DuesList duesList={userDetails.duesList} {...formProps} />
                  </div>
                  <div>
                    <UpdateForm {...formProps} timeSlots={timings} />
                  </div>
                </div>
              </>
            ) : (
              <EnrollForm {...formProps} timeSlots={timings} />
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-700 mt-16">
          Welcome! Please&nbsp;
          <span className="text-blue-500 font-semibold">login</span>
          &nbsp;if you're an existing user, or&nbsp;
          <span className="text-green-500 font-semibold">signup</span>
          &nbsp;if you are new.
        </p>
      )}
    </>
  );
};

export default Home;
