const service = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const VALID_PROPERTIES = ["content", "score"];

//checks if user has entered atleast content or score properties
//to update review.

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

// checks if review exists at given reviewId and
// assigns the value to response local parameter

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;

  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  return next({ status: 404, message: `Review cannot be found.` });
}

// list all reviews of movie that matches given movieId

async function list(req, res) {
  res.json({ data: await service.list(req.params.movieId) });
}

//takes data object and updates review at given reviewId

async function update(req, res) {
  const updateReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await service.update(updateReview);
  data = await service.read(updateReview.review_id);
  res.json({ data });
}

//deletes review at given reviewId

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
