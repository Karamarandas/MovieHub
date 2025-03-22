import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import useMovieStore from "../store/useMovieStore";
import questionMark from "../assets/questionMark.png";

const SearchBar = () => {
  const { query, results, searchLoading, setQuery, searchMovies } =
    useMovieStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      searchMovies(query);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [query, searchMovies, setShowDropdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 overflow-ellipsis border-none outline-none rounded-l-lg text-black"
        />
        <button
          type="submit"
          className="px-3 py-3 bg-orange-500 text-white rounded-r-lg hover:cursor-pointer"
        >
          <Search size={20} />
        </button>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 max-h-60 overflow-auto z-50">
          {searchLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : results.length > 0 ? (
            results.map((movie) => (
              <Link
                key={movie.id}
                to={`/details/${movie.id}`}
                className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setShowDropdown(false)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w154/${movie.poster_path}`
                      : questionMark
                  }
                  alt={movie.title}
                  className="w-10 h-14 rounded"
                />
                <span className="text-black">{movie.title}</span>
              </Link>
            ))
          ) : (
            <p className="p-4 text-gray-500">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
