const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "USER"
    },
    type: {
      type: String,
      required: true,
      default: "NORMAL"
    },
    google_id: {
      type: String,
      required: true,
      default: "NOT_AVAILABLE"
    },
    facebook_id: {
      type: String,
      required: true,
      default: "NOT_AVAILABLE"
    },
    isVerified: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: Number,
      required: true,
      default: 1
    },
    isArchive: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

module.exports = User = mongoose.model("user", UserSchema);
