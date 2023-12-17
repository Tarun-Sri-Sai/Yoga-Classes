import { useUserContext } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import EnrollForm from "../components/EnrollForm";

const Home = () => {
  const { isLoggedIn, user } = useUserContext();

  const [userDetails, setUserDetails] = useState({
    name: "",
    timeSlot: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (!isLoggedIn) {
        return;
      }

      const url = import.meta.env.VITE_SERVER_URL + "/user-details";

      const response = await axios.get(url, {
        headers: {
          token: user.token,
        },
      });

      if (response.data.message === "Success") {
        setUserDetails(response.data.userDetails);
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

  const detailsSection = (
    <p>You are enrolled in {timings.get(userDetails.timeSlot)}</p>
  );

  const enrolledCourse = userDetails.isEnrolled ? (
    { detailsSection }
  ) : (
    <EnrollForm user={user} />
  );

  const loggedInPage = (
    <>
      <div>{welcomeSection}</div>
      <div>{enrolledCourse}</div>
    </>
  );
  const loggedOutPage = <p>Please login (or) signup if you are new.</p>;

  return <>{isLoggedIn ? loggedInPage : loggedOutPage}</>;
};

export default Home;
