const { Contacts } = require("./mongooseModel");

async function listContacts() {
  try {
    const contacts = await Contacts.find({});
    return contacts;
  } catch (err) {
    console.error(err);
  }
}

async function getContactById(contactId) {
  try {
    const getContact = await Contacts.findById(contactId);
    return getContact;
  } catch (err) {
    console.error(err);
  }
}

async function removeContact(contactId) {
  try {
    const newContacts = await Contacts.findByIdAndRemove(contactId);
    // if (contacts.length === newContacts.length) return false;
    return newContacts;
  } catch (err) {
    console.error(err);
  }
}

async function addContact({ name, email, phone, favorite = false }) {
  const newContact = {
    name,
    email,
    phone,
    favorite,
  };
  try {
    const newContacts = await new Contacts(newContact);
    await newContacts.save();
    return newContacts;
  } catch (err) {
    console.error(err);
  }
}

async function updateContact(contactId, body) {
  try {
    await Contacts.findByIdAndUpdate(contactId, {
      $set: body,
    });
    return getContactById(contactId);
  } catch (err) {
    console.error(err);
  }
}

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;

  try {
    await Contacts.findByIdAndUpdate(contactId, {
      $set: { favorite },
    });
    return getContactById(contactId);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
