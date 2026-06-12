const DataItem = require('../models/DataItem');

// GET /api/data - Ambil semua data
exports.getAllData = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status } = req.query;
        const query = {};

        if (category) query.category = category;
        if (status) query.status = status;

        const data = await DataItem.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await DataItem.countDocuments(query);

        res.json({
            success: true,
            count: data.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data
        });
    } catch (error) {
        console.error('Get all data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data: ' + error.message
        });
    }
};

// GET /api/data/:id - Ambil data berdasarkan ID
exports.getDataById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        const data = await DataItem.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            });
        }

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Get data by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data: ' + error.message
        });
    }
};

// POST /api/data - Tambah data baru
exports.createData = async (req, res) => {
    try {
        const { title, description, amount, category, status } = req.body;

        // BUG: category tidak divalidasi! Developer lupa menambahkan 'category'
        if (!title || !description || !amount) {  // ← category dihapus dari validasi!
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title, description, amount'
            });
        }

        const newData = new DataItem({
            title,
            description,
            amount,
            category,
            status: status || 'active'
        });

        await newData.save();

        res.status(201).json({
            success: true,
            message: 'Data created successfully',
            data: newData
        });
    } catch (error) {
        console.error('Create data error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create data: ' + error.message
        });
    }
};

// PUT /api/data/:id - Update data
exports.updateData = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, amount, category, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (amount) updateData.amount = amount;
        if (category) updateData.category = category;
        if (status) updateData.status = status;

        const updatedData = await DataItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            });
        }

        res.json({
            success: true,
            message: 'Data updated successfully',
            data: updatedData
        });
    } catch (error) {
        console.error('Update data error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update data: ' + error.message
        });
    }
};

// DELETE /api/data/:id - Hapus data
exports.deleteData = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format'
            });
        }

        const deletedData = await DataItem.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            });
        }

        res.json({
            success: true,
            message: 'Data deleted successfully',
            data: deletedData
        });
    } catch (error) {
        console.error('Delete data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete data: ' + error.message
        });
    }
};

// Tambahkan di awal file
const mongoose = require('mongoose');