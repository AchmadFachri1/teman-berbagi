const express = require('express');
const router = express.Router();
const {
    getAllData,
    getDataById,
    createData,
    updateData,
    deleteData
} = require('../controllers/dataController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (tanpa autentikasi untuk GET)
router.get('/', getAllData);
router.get('/:id', getDataById);

// Protected routes (perlu autentikasi untuk write operations)
router.post('/', protect, createData);
router.put('/:id', protect, updateData);
router.delete('/:id', protect, deleteData);

module.exports = router;