const { Schema, model } = require("mongoose");

const logSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    set: (d) => d ? new Date(d) : new Date,
    default: () => new Date,
    transform: d => d.toDateString(),
  },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
});

const Log = model("Log", logSchema);
module.exports = Log;
