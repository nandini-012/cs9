import { getQueries, createQuery, updateQuery, deleteQuery } from '../db.js';

export const getAllQueries = async (req, res) => {
  try {
    const queries = await getQueries();
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving queries', error: error.message });
  }
};

export const addQuery = async (req, res) => {
  try {
    const queryData = req.body;
    if (!queryData.id) {
      queryData.id = 'q-' + Math.floor(1000 + Math.random() * 9000);
    }
    // Bind the author email dynamically to the authenticated user
    queryData.authorEmail = req.user.email;
    const newQuery = await createQuery(queryData);
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: 'Error creating query', error: error.message });
  }
};

export const editQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateQuery(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating query', error: error.message });
  }
};

export const removeQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteQuery(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Query not found' });
    }
    res.status(200).json({ message: 'Query deleted successfully', query: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting query', error: error.message });
  }
};
