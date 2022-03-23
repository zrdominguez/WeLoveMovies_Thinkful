const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { movieId } = req.params;
  console.log((await service.list()).length);
  movieId
    ? res.json({ data: await service.read(movieId) })
    : res.json({ data: await service.list() });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
