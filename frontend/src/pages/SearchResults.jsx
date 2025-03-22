import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useMovieStore from "../store/useMovieStore.js";
import { Loader2 } from "lucide-react";
import questionMark from "../assets/questionMark.png";

const SearchResults = () => {
  const { query } = useParams();
  const { results, searchLoading, searchMovies } = useMovieStore();

  useEffect(() => {
    if (query) {
      searchMovies(query);
    }
  }, [query, searchMovies]);

  return (
    <div className="p-6 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          🔎 Search Results for "{query}"
        </h2>

        {searchLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((movie) => (
              <Link
                key={movie.id}
                to={`/details/${movie.id}`}
                className="block hover:scale-105 transition-transform"
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                        : questionMark
                    }
                    alt={movie.title}
                    className="w-full h-64 object-cover"
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
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-xl">No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
