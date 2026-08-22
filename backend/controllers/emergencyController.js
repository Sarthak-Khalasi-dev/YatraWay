// Standalone Emergency Contact Controller with in-memory store
let contactsStore = [
  {
    _id: 'c1',
    name: 'Rajesh Sharma',
    relation: 'Father',
    phone: '+91 98765 43210',
    initial: 'R'
  },
  {
    _id: 'c2',
    name: 'Priya Sharma',
    relation: 'Sister',
    phone: '+91 98765 12345',
    initial: 'P'
  },
  {
    _id: 'c3',
    name: 'Indian Embassy Bali',
    relation: 'Embassy / Consulate',
    phone: '+62 361 226228',
    initial: 'I'
  }
];

const getContacts = async (req, res) => {
  res.json(contactsStore);
};

const createContact = async (req, res) => {
  const { name, relation, phone } = req.body;
  const newContact = {
    _id: 'c_' + Date.now(),
    name,
    relation,
    phone,
    initial: (name || 'E').charAt(0).toUpperCase(),
  };
  contactsStore.unshift(newContact);
  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const idx = contactsStore.findIndex(c => c._id === req.params.id);
  if (idx !== -1) {
    contactsStore.splice(idx, 1);
    res.json({ message: 'Contact removed' });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
};

module.exports = {
  getContacts,
  createContact,
  deleteContact,
};
