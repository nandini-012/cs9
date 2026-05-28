const Query = require('../models/Query');

// @desc    Get queries (For student track, or admin inbox)
// @route   GET /api/queries
// @access  Private
const getQueries = async (req, res) => {
    res.status(200).json({ message: 'Get queries' });
};

// @desc    Create a query (u6)
// @route   POST /api/queries
// @access  Private (Student)
const createQuery = async (req, res) => {
    res.status(200).json({ message: 'Create query' });
};

// @desc    Update a query (Peers resolving, Auto-escalate, Admin resolved, marking as resolved)
// @route   PUT /api/queries/:id
// @access  Private
const updateQuery = async (req, res) => {
    res.status(200).json({ message: `Update query ${req.params.id}` });
};

// @desc    Report a query for violating code of conduct (u10)
// @route   POST /api/queries/:id/report
// @access  Private (Peer)
const reportQuery = async (req, res) => {
    res.status(200).json({ message: `Report query ${req.params.id}` });
};

module.exports = {
    getQueries,
    createQuery,
    updateQuery,
    reportQuery
};
