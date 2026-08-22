const express = require('express');
const router = express.Router();
const {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         dest:
 *           type: string
 *         dates:
 *           type: string
 *         status:
 *           type: string
 *         days:
 *           type: number
 *         budget:
 *           type: number
 *         spent:
 *           type: number
 *         members:
 *           type: number
 *         progress:
 *           type: number
 *         notes:
 *           type: string
 *         img:
 *           type: string
 *         activities:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all user trips
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: Trip created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Not authorized
 */
router.route('/')
  .get(protect, getTrips)
  .post(protect, createTrip);

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Update a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       200:
 *         description: Trip updated
 *       404:
 *         description: Trip not found
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
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
 *         description: Trip removed
 *       404:
 *         description: Trip not found
 */
router.route('/:id')
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

module.exports = router;
