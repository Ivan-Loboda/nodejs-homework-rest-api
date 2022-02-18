const express = require("express");

const router = express.Router();

const { addPostValidation } = require("../../middlevares/validate.js");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts.js");

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  !contact
    ? res.status(404).json({ message: "Contact not found" })
    : res.json({ contact });
});

router.post("/", addPostValidation, async (req, res, next) => {
  const newContact = await addContact(req.body);
  res.status(201).json({ newContact });
});

router.delete("/:contactId", async (req, res, next) => {
  const contacts = await removeContact(req.params.contactId);
  !contacts
    ? res.status(404).json({ message: "Contact not found" })
    : res.json({ message: "Сontact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  const contact = await updateContact(req.params.contactId, req.body);
  !contact
    ? res.status(404).json({ message: "Couldn't update contact" })
    : res.json({ contact });
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ message: "Missing field Favorite" });
  const contact = await updateStatusContact(req.params.contactId, req.body);
  !contact
    ? res.status(404).json({ message: "Contact not found" })
    : res.json({ contact });
});

module.exports = router;
