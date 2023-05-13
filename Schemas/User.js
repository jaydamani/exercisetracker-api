const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    log: [
      {
        type: Schema.Types.ObjectId,
        ref: "Log",
      },
    ],
  },
  {
    toJSON: {
    //   transform: (json) => {
    //     if ("log" in json) json.count = json.log.length;
    //     return json;
    //   },
    },
  }
);
const User = model("User", UserSchema);

module.exports = User;
