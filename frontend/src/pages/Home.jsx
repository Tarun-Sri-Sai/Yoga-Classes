import { useUserContext } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import EnrollForm from "../components/EnrollForm";
import DuesList from "../components/DuesList";
import UpdateForm from "../components/UpdateForm";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isLoggedIn, user, logoutUser } = useUserContext();
  const navigate = useNavigate()

  const [userDetails, setUserDetails] = useState({
    name: "",
    timeSlot: "",
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
          navigate("/login")
        }
      } catch (error) {
        console.log(`Tried ${url} with ${headers}\nError: ${error}`);
      }
    };

    fetchDetails();
  }, []);

  const welcomeSection = <p>Welcome {userDetails.name}</p>;

  const timings = new Map([
    ["0", "6 to 7"],
    ["1", "7 to 8"],
    ["2", "8 to 9"],
    ["3", "5 to 6"],
  ]);

  const enrolledMessage = (
    <p>You are enrolled in {timings.get(userDetails.timeSlot)}</p>
  );

  const detailsSection = (
    <>
      <div>{enrolledMessage}</div>
      <div>
        <DuesList duesList={userDetails.duesList} />
      </div>
      <div>
        <UpdateForm />
      </div>
    </>
  );

  const enrolledCourse = userDetails.isEnrolled ? (
    detailsSection
  ) : (
    <EnrollForm />
  );

  const loggedInPage = (
    <>
      <div>{welcomeSection}</div>
      <div>{enrolledCourse}</div>
    </>
  );
  const loggedOutPage = (
    <p>Please login if you're an existing user (or) signup if you are new.</p>
  );

  return <>{isLoggedIn ? loggedInPage : loggedOutPage}</>;
};

export default Home;
