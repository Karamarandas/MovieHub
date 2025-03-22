import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import useUserStore from "./useUserStore.js";

const useMovieStore = create((set) => ({
  trending: [],
  topRated: [],
  featured: [],
  nowPlaying: [],
  upcoming: [],
  genres: [],
  movie: {},
  cast: [],
  trailers: [],
  isHomeLoading: false,
  isDetailsLoading: false,
  isGenresLoading: false,
  genreName: "",
  movies: [],
  query: "",
  results: [],
  searchLoading: false,
  similarMovies: [],
  watchlist: [],
  isWatchlistLoading: false,
  watchlistMovies: [],

  fetchMovies: async () => {
    set({ isHomeLoading: true });
    try {
      const [
        trendingRes,
        topRatedRes,
        featuredRes,
        nowPlayingRes,
        upcomingRes,
        genresRes,
      ] = await Promise.all([
        axiosInstance.get("/movies/trending"),
        axiosInstance.get("/movies/top-rated"),
        axiosInstance.get("/movies/featured"),
        axiosInstance.get("/movies/now-playing"),
        axiosInstance.get("/movies/upcoming"),
        axiosInstance.get("/movies/genres"),
      ]);

      set({
        trending: trendingRes.data.results,
        topRated: topRatedRes.data.results,
        featured: featuredRes.data.results,
        nowPlaying: nowPlayingRes.data.results,
        upcoming: upcomingRes.data.results,
        genres: genresRes.data.genres,
        isHomeLoading: false,
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
      set({ isHomeLoading: false });
    }
  },

  fetchMovieDetails: async (id) => {
    set({ isDetailsLoading: true });
    try {
      const [movieRes, castRes, trailersRes] = await Promise.all([
        axiosInstance.get(`/movies/${id}`),
        axiosInstance.get(`/movies/${id}/credits`),
        axiosInstance.get(`/movies/${id}/videos`),
      ]);

      set({
        movie: movieRes.data,
        cast: castRes.data.cast,
        trailers: trailersRes.data,
        isDetailsLoading: false,
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
      set({ isDetailsLoading: false });
    }
  },

  fetchMoviesByGenre: async (id) => {
    set({ isGenresLoading: true });
    try {
      const genresRes = await axiosInstance.get("/movies/genres");
      const genre = genresRes.data.genres.find((g) => g.id === parseInt(id));
      set({ genreName: genre ? genre.name : "Unknown" });

      const moviesRes = await axiosInstance.get(`/movies/genre/${id}`);
      set({ movies: moviesRes.data.results, isGenresLoading: false });
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      set({ isGenresLoading: false });
    }
  },

  setQuery: (query) => set({ query }),

  searchMovies: async (query) => {
    if (!query) return set({ results: [], searchLoading: false });

    set({ searchLoading: true });
    try {
      const response = await axiosInstance.get(
        `/movies/search/${encodeURIComponent(query)}`
      );
      set({ results: response.data.results });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      set({ searchLoading: false });
    }
  },

  fetchSimilarMovies: async (id) => {
    set({ isDetailsLoading: true });
    try {
      const response = await axiosInstance.get(`/movies/${id}/similar`);
      set({ similarMovies: response.data, isDetailsLoading: false });
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      set({ isDetailsLoading: false });
    }
  },

  fetchMoviesForWatchlist: async (watchlist) => {
    try {
      set({ watchlistMovies: [] });

      const movieDetails = await Promise.all(
        watchlist.map(async (watchlistMovie) => {
          const response = await axiosInstance.get(
            `/movies/${watchlistMovie.movie_id}`
          );
          return response.data;
        })
      );

      set({ watchlistMovies: movieDetails });
    } catch (error) {
      console.error("Error fetching movies for watchlist:", error);
    }
  },

  fetchWatchlist: async () => {
    const { authUser } = useUserStore.getState();
    if (!authUser) return;

    set({ isWatchlistLoading: true });
    try {
      const response = await axiosInstance.get(
        `/movies/watchlist/${authUser.id}`
      );
      set({ watchlist: response.data.watchlist });
    } catch (error) {
      console.error("Error in fetchWatchlist:", error.response?.data?.message);
      throw error;
    } finally {
      set({ isWatchlistLoading: false });
    }
  },

  addToWatchlist: async (movieID) => {
    const { authUser } = useUserStore.getState();
    if (!authUser) return;

    set({ isWatchlistLoading: true });
    try {
      const response = await axiosInstance.post("/movies/watchlist", {
        movieID: parseInt(movieID),
      });
      set((state) => ({
        watchlist: [...state.watchlist, response.data.movie],
      }));
      return response.data;
    } catch (error) {
      console.error("Error in addToWatchlist:", error.response?.data?.message);
      throw error;
    } finally {
      set({ isWatchlistLoading: false });
    }
  },

  removeFromWatchlist: async (movieID) => {
    const { authUser } = useUserStore.getState();
    if (!authUser) return;

    set({ isWatchlistLoading: true });
    try {
      const response = await axiosInstance.delete(
        `/movies/watchlist/${authUser.id}/${movieID}`
      );
      set((state) => ({
        watchlist: state.watchlist.filter(
          (movie) => movie.movie_id !== Number(movieID)
        ),
      }));
      return response.data;
    } catch (error) {
      console.error(
        "Error in removeFromWatchlist:",
        error.response?.data?.message
      );
    } finally {
      set({ isWatchlistLoading: false });
    }
  },
}));

export default useMovieStore;
