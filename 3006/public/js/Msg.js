const mongoose = require("mongoose");

const messagesSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    minLength: 4,
    maxLength: 20,
  },

  msg: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("msg", messagesSchema);
