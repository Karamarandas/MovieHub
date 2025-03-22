import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMovieStore from "../store/useMovieStore.js";
import { Loader2 } from "lucide-react";
import questionMark from "../assets/questionMark.png";

const Genres = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isGenresLoading, fetchMoviesByGenre, movies, genreName } = useMovieStore();

  useEffect(() => {
    fetchMoviesByGenre(id);
  }, [id, fetchMoviesByGenre]);

  if (isGenresLoading)
    return (
      <div className="min-h-screen flex justify-center center items-center">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">{genreName}</h2>
      <div className="space-y-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition"
            onClick={() => navigate(`/details/${movie.id}`)}
          >
            
            <div className="w-16 h-24 flex items-center justify-center">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w154/${movie.poster_path}`
                    : questionMark
                }
                alt={movie.title}
                className="w-16 h-24 object-cover rounded"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">
                {movie.title}
              </h3>
              <p className="text-gray-400">
                Release Date: {movie.release_date || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres;
