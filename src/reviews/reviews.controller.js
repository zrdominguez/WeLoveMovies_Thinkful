const service = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const VALID_PROPERTIES = ["content", "score"];

function hasOnlyValidProperties(req, res, next) {
  const { data } = req?.body || {};
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;

  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  return next({ status: 404, message: `Review cannot be found.` });
}

async function list(req, res) {
  res.json({ data: await service.list(req.params.movieId) });
}

async function update(req, res) {
  const updateReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await service.update(updateReview);
  data = await service.read(updateReview.review_id);
  res.json({ data });
}

async function destroy(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [
    asyncErrorBoundary(reviewExists),
    hasOnlyValidProperties,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
