import AddToWatchlistButton from "./AddToWatchlistButton";

const Details = ({ movie }) => {
  return (
    <div className="flex justify-between">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
        <p className="text-gray-400 mb-4">{movie.overview}</p>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-yellow-400 text-2xl">
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
          <span className="text-gray-400">({movie.vote_count} votes)</span>
        </div>

        {movie.homepage && (
          <a
            href={movie.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            Official Website
          </a>
        )}
      </div>

      <div className="ml-8">
        <AddToWatchlistButton movieID={movie.id} />
      </div>
    </div>
  );
};

export default Details;
