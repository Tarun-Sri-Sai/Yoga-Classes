import { useUserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { isLoggedIn } = useUserContext();

  const navStyle = "bg-gray-800 text-white p-4 mt-4";
  const linkStyle = "mx-2 hover:text-gray-300";

  return (
    <nav className={navStyle}>
      <ul className="flex items-center justify-center">
        <li className={linkStyle}>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <li className={linkStyle}>
            <Link to="/logout">Logout</Link>
          </li>
        ) : (
          <>
            <li className={linkStyle}>
              <Link to="/login">Login</Link>
            </li>
            <li className={linkStyle}>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
