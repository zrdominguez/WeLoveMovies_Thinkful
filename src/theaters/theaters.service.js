const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//trying to prototype a helper function to assign an obj
//to reduceProperties function with key, value pairs of obj movie

/*function movieKeys(movie){
  const movieKey = Object.keys(movie);
  const result = {};
  forEach.movieKey(key=>)
}*/

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  is_showing: ["movies", null, "is_showing"],
});

//list each theater with all their movies
//contained in object movies

function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .then((theaters) => reduceMovies(theaters));
}

//finds movie that matches movieId and returns
//the movie and theater if is_showing is true

function read(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ "mt.movie_id": movieId, "mt.is_showing": true });
}

module.exports = {
  list,
  read,
};
