const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 3
  },
  address: {
    type: String,
    required: true
  },
  seedPhrase: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  }
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
}

module.exports = mongoose.model("User", UserSchema);