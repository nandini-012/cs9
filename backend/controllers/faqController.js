const FAQ = require('../models/FAQ');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public/Private
const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({}).sort({ updatedAt: -1 });
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create an FAQ (Admin)
// @route   POST /api/faqs
// @access  Private (Admin)
const createFAQ = async (req, res) => {
    try {
        const { category, question, answer, status } = req.body;
        const faq = new FAQ({
            category,
            question,
            answer,
            status: status || 'Active'
        });
        const createdFAQ = await faq.save();
        res.status(201).json(createdFAQ);
    } catch (error) {
        res.status(400).json({ message: 'Invalid FAQ data', error: error.message });
    }
};

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private (Admin)
const updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (faq) {
            faq.category = req.body.category || faq.category;
            faq.question = req.body.question || faq.question;
            faq.answer = req.body.answer || faq.answer;
            faq.status = req.body.status || faq.status;
            
            const updatedFAQ = await faq.save();
            res.status(200).json(updatedFAQ);
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private (Admin)
const deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (faq) {
            await FAQ.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'FAQ removed' });
        } else {
            res.status(404).json({ message: 'FAQ not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ
};
