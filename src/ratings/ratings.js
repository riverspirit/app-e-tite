const {db, collections, configStore} = require('../db');

function getRating(placeId) {
  return new Promise((resolve) => {
    setImmediate(() => {
      const collection = db.getCollection(collections.RATINGS);
      const allRatings = collection.find({placeId});
      // console.log(allRatings)
      const sumOfRatings = allRatings.reduce((sum, currentItem) => sum + currentItem.ratingValue, 0);
      // console.log(sumOfRatings)
      const ratingCount = allRatings.length;
      const average = sumOfRatings / ratingCount;
      const newRating = Math.round(average);
      // console.log({newRating, ratingCount})
      resolve({newRating, ratingCount});
    });
  });
}

function saveRating(placeId, ratingValue, ratingText) {
  const collection = db.getCollection(collections.RATINGS);
  const author = configStore.get('deviceId');
  const timestamp = new Date().getTime();
  collection.insert({placeId, ratingValue, ratingText, author, timestamp});
  return getRating(placeId);
}

function getReviews(placeId) {
  const collection = db.getCollection(collections.RATINGS);
  const allRatings = collection.find({placeId});
  return allRatings;
}

module.exports = {saveRating, getRating, getReviews};
