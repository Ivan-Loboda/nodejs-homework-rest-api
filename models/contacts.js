const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "./contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (err) {
    console.error(err);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const getContact = contacts.find(
      (contact) => contact.id.toString() === contactId
    );
    return getContact;
  } catch (err) {
    console.error(err);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter(
      (contact) => contact.id.toString() !== contactId
    );
    if (contacts.length === newContacts.length) return false;
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return newContacts;
  } catch (err) {
    console.error(err);
  }
}

async function addContact({ name, email, phone }) {
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  try {
    const contacts = await listContacts();
    const newContacts = [...contacts, newContact];
    fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return newContacts;
  } catch (err) {
    console.error(err);
  }
}

async function updateContact(contactId, body) {
  try {
    const contacts = await listContacts();
    const { allContacts, updatedContact } = contacts.reduce(
      (acc, contact) => {
        if (contact.id === contactId) {
          const updatedContact = {
            ...contact,
            name: body.name,
            email: body.email,
            phone: body.phone,
          };
          acc.updatedContact = updatedContact;
          acc.allContacts.push(updatedContact);
        } else {
          acc.allContacts.push(contact);
        }
        return acc;
      },
      { allContacts: [], updatedContact: null }
    );
    fs.writeFile(contactsPath, JSON.stringify(allContacts));
    return updatedContact;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
