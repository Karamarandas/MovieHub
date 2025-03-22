import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Genres from "./components/Genres";
import MovieDetails from "./pages/MovieDetails";
import SearchResults from "./pages/SearchResults";
import Watchlist from "./pages/Watchlist";
import useUserStore from "./store/useUserStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  const { authUser, isCheckingAuth, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }
  return (
    <Routes>
      <Route
        path="/login"
        element={!authUser ? <Login /> : <Navigate to="/" />}
      />
      
      <Route
        path="/signup"
        element={!authUser ? <Signup /> : <Navigate to="/" />}
      />

      <Route
        path="/forgot-password"
        element={!authUser ? <ForgotPassword /> : <Navigate to="/" />}
      />

      <Route
        path="/reset-password"
        element={!authUser ? <ResetPassword /> : <Navigate to="/" />}
      />

      <Route
        path="/"
        element={authUser ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/genre/:id"
        element={authUser ? <Genres /> : <Navigate to="/login" />}
      />

      <Route
        path="/details/:id"
        element={authUser ? <MovieDetails /> : <Navigate to="/login" />}
      />

      <Route
        path="/search/:query"
        element={authUser ? <SearchResults /> : <Navigate to="/login" />}
      />

      <Route
        path="/watchlist"
        element={authUser ? <Watchlist /> : <Navigate to="/login" />}
      />

      <Route
        path="/profile"
        element={authUser ? <Profile /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
