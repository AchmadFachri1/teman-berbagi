const mongoose = require('mongoose');

const dataItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [1000, 'Amount must be at least 1000'],
        max: [1000000000, 'Amount cannot exceed 1 billion']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['donation', 'education', 'health', 'disaster', 'other']
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'completed', 'cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Perbaiki middleware - hapus parameter next yang tidak diperlukan
dataItemSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

dataItemSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const DataItem = mongoose.model('DataItem', dataItemSchema);

module.exports = DataItem;