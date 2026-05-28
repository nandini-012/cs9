const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Submitted', 'Peer Resolving', 'Escalated', 'Resolved'], default: 'Submitted' },
    resolution: [{
        peer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        createdAt: { type: Date, default: Date.now }
    }],
    adminNotes: { type: String },
    isViolating: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Query', querySchema);
