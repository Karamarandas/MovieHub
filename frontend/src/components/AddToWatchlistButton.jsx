import { Heart, Loader2 } from "lucide-react";
import useMovieStore from "../store/useMovieStore.js";

const AddToWatchlistButton = ({ movieID }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist, isWatchlistLoading } =
    useMovieStore();

  const isInWatchlist = watchlist.some((movie) => movie.movie_id === movieID);

  const handleWatchlistClick = async () => {
    if (isInWatchlist) {
      await removeFromWatchlist(movieID);
    } else {
      await addToWatchlist(movieID);
    }
  };

  return (
    <button
      onClick={handleWatchlistClick}
      disabled={isWatchlistLoading}
      className="p-2 rounded-full bg-black bg-opacity-50 hover:cursor-pointer hover:bg-opacity-70 transition duration-300 text-white"
    >
      {isWatchlistLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <Heart
          size={24}
          className={isInWatchlist ? "text-red-500 fill-red-500" : "text-white"}
        />
      )}
    </button>
  );
};

export default AddToWatchlistButton;
