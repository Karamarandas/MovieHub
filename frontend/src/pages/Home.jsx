import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCarousel from "../components/MovieCarousel";
import useMovieStore from "../store/useMovieStore";
import { Loader2 } from "lucide-react";
import SearchBar from "../components/SearchBar";

function Home() {
  const {
    trending,
    topRated,
    featured,
    upcoming,
    nowPlaying,
    genres,
    fetchMovies,
    isHomeLoading,
  } = useMovieStore();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (isHomeLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );

  return (
    <div className="flex px-6 py-4 gap-6">
      <div className="w-3/4">
        <MovieCarousel movies={trending} title="🔥 Trending Movies" />

        <MovieCarousel movies={nowPlaying} title="🎬 Now Playing" />

        <MovieCarousel movies={upcoming} title="🚀 Upcoming Movies" />

        <MovieCarousel movies={topRated} title="⭐ Top Rated Movies" />

        <MovieCarousel movies={featured} title="🌟 Featured Movies" />

        <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-4">
          🎭 Genres
        </h2>
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              to={`/genre/${genre.id}`}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 transition"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Section (Search Bar) */}
      <div className="w-1/4">
        <div className="sticky top-4">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            🔍 Search Movies
          </h2>
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default Home;
