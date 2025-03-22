import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import questionMark from "../assets/questionMark.png";

const MovieCarousel = ({ movies, title }) => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [Autoplay({ delay: 2000 })]
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-orange-600 mb-3">{title}</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/details/${movie.id}`}
              className="min-w-[120px] flex-shrink-0 hover:scale-105 transition-transform"
            >
              <div className="relative ml-2 h-64 group">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w154/${movie.poster_path}`
                      : questionMark
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-lg shadow-md aspect-[2/3]"
                />
                
                <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg p-2">
                  <h3 className="text-sm font-bold">{movie.title}</h3>
                  <p className="text-xs">{movie.release_date?.split("-")[0]}</p>
                  <p className="text-yellow-400 text-xs font-semibold">
                    ⭐ {movie.vote_average?.toFixed(1) ?? "N/A"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
