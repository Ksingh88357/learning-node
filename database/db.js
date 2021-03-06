const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db = process.env.MONGO_DB_URL;

mongoose.Promise = global.Promise;

const connectDB = async () => {
  console.log("db...", db);
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log("MongoDB Error...", err);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
