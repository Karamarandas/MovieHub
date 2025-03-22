import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMovieStore from "../store/useMovieStore.js";
import Trailer from "../components/Trailer.jsx";
import Cast from "../components/Cast.jsx";
import Details from "../components/Details.jsx";
import { Loader2 } from "lucide-react";
import MovieCarousel from "../components/MovieCarousel.jsx";
import AdditionalInfo from "../components/AdditionalInfo.jsx";
import Companies from "../components/Companies.jsx";

const MovieDetails = () => {
  const { id } = useParams();
  const {
    fetchMovieDetails,
    fetchSimilarMovies,
    isDetailsLoading,
    movie,
    cast,
    trailers,
    similarMovies,
  } = useMovieStore();

  useEffect(() => {
    fetchMovieDetails(id);
    fetchSimilarMovies(id);
  }, [id, fetchMovieDetails, fetchSimilarMovies]);

  if (isDetailsLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );

  return (
    <div className="container mx-auto p-6 text-white">
      {movie.backdrop_path && (
        <div className="relative h-96 overflow-hidden rounded-lg mb-8">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-center">{movie.title}</h1>
          </div>
        </div>
      )}

      <Details movie={movie} />

      <AdditionalInfo movie={movie} />

      <Companies movie={movie}/>

      <Trailer trailers={trailers} />

      <Cast cast={cast} />

      {similarMovies.length > 0 && (
        <div className="mt-8">
          <MovieCarousel movies={similarMovies} title="🎬 Similar Movies" />
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
