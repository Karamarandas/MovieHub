import { Router } from "express";
import axios from "axios";
import { checkLogin } from "../middlewares/authMiddleware.js";
import db from "../config/db.js";

const router = Router();
const url = "https://api.themoviedb.org/3";
const apiKey = process.env.TMDB_API_KEY;

// trending movies
router.get("/trending", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/trending/movie/day?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// now-playing movies
router.get("/now-playing", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/movie/now_playing?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// upcoming movies
router.get("/upcoming", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/movie/upcoming?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// top rated movies
router.get("/top-rated", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/movie/top_rated?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// featured movies
router.get("/featured", async (req, res) => {
  try {
    const response = await axios.get(`${url}/movie/popular?api_key=${apiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// genres list
router.get("/genres", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/genre/movie/list?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// movies by genre
router.get("/genre/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/discover/movie?api_key=${apiKey}&with_genres=${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch movie credits (cast)
router.get("/:id/credits", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/movie/${req.params.id}/credits?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch movie trailers
router.get("/:id/videos", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/movie/${req.params.id}/videos?api_key=${apiKey}`
    );
    const trailers = response.data.results.filter(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );
    res.json(trailers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch movie details
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${url}/movie/${req.params.id}?api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search movies
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`;
    const response = await axios.get(tmdbUrl);

    if (response.status !== 200) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = response.data;
    return res.status(200).json(data);
  } catch (error) {
    console.error("Search Error:", error.message || error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch similar movies
router.get("/:id/similar", async (req, res) => {
  try {
    const { id } = req.params;

    const tmdbUrl = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`;

    const response = await axios.get(tmdbUrl);

    if (response.status !== 200) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = response.data;

    return res.status(200).json(data.results);
  } catch (error) {
    console.error("Similar Movies Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch watchlist
router.get("/watchlist/:userID", checkLogin, async (req, res) => {
  const { userID } = req.params;

  try {
    const result = await db.query(
      "SELECT movie_id FROM watchlist WHERE user_id = $1",
      [userID]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ watchlist: result.rows });
    } else {
      res.status(200).json({ watchlist: [] });
    }
  } catch (error) {
    console.log("Error in fetchWatchlist", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// add to watchlist
router.post("/watchlist", checkLogin, async (req, res) => {
  const { movieID } = req.body;
  const userID = req.user.id;

  try {
    const movieExist = await db.query(
      "SELECT * FROM watchlist WHERE user_id = $1 AND movie_id = $2",
      [userID, movieID]
    );
    if (movieExist.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Movie already in your watchlist" });
    }

    const result = await db.query(
      "INSERT INTO watchlist (user_id, movie_id) VALUES ($1, $2) RETURNING *",
      [userID, movieID]
    );

    res
      .status(201)
      .json({ message: "Movie added to watchlist", movie: result.rows[0] });
  } catch (error) {
    console.log("Error in addToWatchlist", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// remove from watchlist
router.delete("/watchlist/:userID/:movieID", checkLogin, async (req, res) => {
  const { userID, movieID } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2 RETURNING *",
      [userID, movieID]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Movie not found in your watchlist" });
    }
    res.status(200).json({ message: "Movie removed from watchlist" });
  } catch (error) {
    console.log("Error in removeFromWatchlist", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
