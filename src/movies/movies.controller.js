const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//checks if movie with given movieId exists and assigns the value
// to response local parameter

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

// Lists all movies unless given the query parameter
// of is_showing where movies which are showing will be listed
async function list(req, res) {
  const { is_showing } = req.query;
  is_showing
    ? res.json({ data: await service.listIsShowing() })
    : res.json({ data: await service.list() });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list,
  movieExists,
};
