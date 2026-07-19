const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
const { createAgreement, getAgreements, getAgreementById } = require('../controllers/rentalController');

// POST   /api/rental-agreements  — Submit a new rental agreement (with file uploads)
router.post('/', upload, createAgreement);

// GET    /api/rental-agreements  — Get all agreements (admin dashboard)
router.get('/', getAgreements);

// GET    /api/rental-agreements/:id  — Get a single agreement by ID
router.get('/:id', getAgreementById);

module.exports = router;
