import { User, LogOut, Home, Heart } from "lucide-react";
import useUserStore from "../store/useUserStore.js";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const { logout, authUser } = useUserStore();
  const location = useLocation();
  const [name, setName] = useState("Sign up");
  const [toEndpoint, setToEndpoint] = useState("/signup");


  useEffect(() => {
    if (location.pathname === "/login") {
      setName("Sign up");
      setToEndpoint("/signup");
    } else if (location.pathname === "/signup") {
      setName("Log in");
      setToEndpoint("/login");
    }
  }, [location.pathname]);

  return (
    <div className="navbar bg-base-100 shadow-2xl px-4">
      <div className="pl-2 flex-1">
        <Link
          to="/"
          className="text-2xl font-bold text-orange-600 p-2 hover:bg-base-200 rounded-lg transition-colors"
        >
          MovieHub
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {authUser ? (
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to="/">
                  <Home className="w-5 h-5" /> Home
                </Link>
              </li>
              <li>
                <Link to="/watchlist">
                  <Heart className="w-5 h-5" /> MyWatchlist
                </Link>
              </li>
              <li>
                <Link to="/profile">
                  <User className="w-5 h-5" /> Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={() => logout()}
                  className="text-red-500"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            to={toEndpoint}
            className="mr-3  border-0 link link-hover link-primary"
          >
            {name}
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
