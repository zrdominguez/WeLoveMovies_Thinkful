const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found." });
}

async function read(req, res) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function readTheaters(req, res) {
  const { movie } = res.locals;
  const theaters = await service.readTheaters(movie.movie_id);
  res.json({ data: theaters });
}

async function readReviews(req, res) {
  const { movie } = res.locals;
  const reviews = await service.readReviews(movie.movie_id);
  res.json({ data: reviews });
}

async function list(req, res) {
  const { is_showing } = req.query;
  console.log(await service.listIsShowing());
  is_showing
    ? res.json({ data: await service.listIsShowing() })
    : res.json({ data: await service.list() });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list,
  movieExists,
};
