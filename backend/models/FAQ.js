const mongoose = require('mongoose');

const faqSchema = mongoose.Schema({
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' }
}, {
    timestamps: true
});

module.exports = mongoose.model('FAQ', faqSchema);
