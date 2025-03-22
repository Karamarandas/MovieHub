import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Trash2 } from "lucide-react";
import questionMark from "../assets/questionMark.png";
import useMovieStore from "../store/useMovieStore.js";

const Watchlist = () => {
  const {
    fetchMoviesForWatchlist,
    watchlistMovies,
    watchlist,
    removeFromWatchlist,
    fetchWatchlist,
    isWatchlistLoading,
  } = useMovieStore();

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  useEffect(() => {
    if (watchlist.length > 0) {
      fetchMoviesForWatchlist(watchlist);
    } else {
      useMovieStore.setState({ watchlistMovies: [] });
    }
  }, [watchlist, fetchMoviesForWatchlist]);

  const handleRemoveMovie = async (movieID) => {
    await removeFromWatchlist(movieID);
  };

  if (isWatchlistLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-8">
          🎬 My Watchlist
        </h1>

        {watchlistMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlistMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative group hover:scale-105 transition-transform"
              >

                <Link to={`/details/${movie.id}`} className="block">
                  <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
                          : questionMark
                      }
                      alt={movie.title}
                      className="w-full h-64 object-fill"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
                      <p className="text-white text-sm font-semibold truncate">
                        {movie.title}
                      </p>
                      <p className="text-xs text-gray-300">
                        {movie.release_date?.split("-")[0]}
                      </p>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => handleRemoveMovie(movie.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">Your watchlist is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
