import { useUserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isLoggedIn } = useUserContext();

  const loggedInLinks = (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/logout">Logout</Link>
      </li>
    </ul>
  );

  const loggedOutLinks = (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/signup">Signup</Link>
      </li>
    </ul>
  );

  return <nav>{isLoggedIn ? loggedInLinks : loggedOutLinks}</nav>;
};

export default NavBar;
