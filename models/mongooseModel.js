const mongoose = require("mongoose");

const contactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectID,
    ref: 'user',
  },
  versionKey: false,
});

const Contacts = mongoose.model("Contacts", contactsSchema);

module.exports = {
  Contacts,
};
