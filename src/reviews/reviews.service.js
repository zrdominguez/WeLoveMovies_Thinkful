const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//create helper function map critic properties to object critic

const addCritic = mapProperties({
  critic: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function read(reviewId) {
  return knex("reviews as r")
    .join("critics as c")
    .select("*")
    .where({ review_id: reviewId })
    .first()
    .then((review) => addCritic(review));
}

function list(movieId) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ "r.movie_id": movieId })
    .then((reviews) => {
      return reviews.map((review) => addCritic(review));
    });
}

function update(updateReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updateReview.review_id })
    .update(updateReview);
}

function destroy(reviewId) {
  return knex("reviews as r").where({ review_id: reviewId }).del();
}

module.exports = {
  read,
  list,
  update,
  delete: destroy,
};
