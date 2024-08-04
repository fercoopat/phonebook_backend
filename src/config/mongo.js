const { MONGODB_URI } = require('./envs');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

function connectDB() {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.log(`Error connecting to MongoDB: ${error?.message}`);
    });
}

module.exports = { connectDB };
