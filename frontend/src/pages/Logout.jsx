import { useUserContext } from "../contexts/UserContext";

const Logout = () => {
  const { isLoggedIn, logoutUser, user } = useUserContext();
  const [status, setStatus] = useState("");

  const attemptLogout = async () => {
    const url = import.meta.env.VITE_SERVER_URL + "/logout";
    const response = await axios.post(url, user.token);

    setStatus(response.data.message);

    if (["Success", "Already logged out"].includes(response.data.message)) {
      logoutUser();
    }
  };

  const logoutForm = (
    <>
      <button onClick={() => attemptLogout}>Logout</button>
      {status}
    </>
  );

  const loggedOutMessage = <p>Already logged out</p>;

  return <>{isLoggedIn ? logoutForm : loggedOutMessage}</>;
};

export default Logout;
