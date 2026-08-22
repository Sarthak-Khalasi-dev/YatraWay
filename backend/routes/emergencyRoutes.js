const express = require('express');
const router = express.Router();
const {
  getContacts,
  createContact,
  deleteContact,
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     EmergencyContact:
 *       type: object
 *       required:
 *         - name
 *         - relation
 *         - phone
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         relation:
 *           type: string
 *         phone:
 *           type: string
 *         initial:
 *           type: string
 */

/**
 * @swagger
 * /api/emergency:
 *   get:
 *     summary: Get all emergency contacts
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EmergencyContact'
 *   post:
 *     summary: Create an emergency contact
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmergencyContact'
 *     responses:
 *       201:
 *         description: Contact created
 */
router.route('/')
  .get(protect, getContacts)
  .post(protect, createContact);

/**
 * @swagger
 * /api/emergency/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Emergency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact removed
 */
router.route('/:id')
  .delete(protect, deleteContact);

module.exports = router;
