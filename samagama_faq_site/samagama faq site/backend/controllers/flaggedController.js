import { getFlaggedItems, createFlaggedItem, updateFlaggedItem, deleteFlaggedItem } from '../db.js';

export const getAllFlagged = async (req, res) => {
  try {
    const flagged = await getFlaggedItems();
    res.status(200).json(flagged);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving flagged items', error: error.message });
  }
};

export const addFlagged = async (req, res) => {
  try {
    const flaggedData = req.body;
    if (!flaggedData.id) {
      flaggedData.id = 'f-' + Math.floor(1000 + Math.random() * 9000);
    }
    const newFlagged = await createFlaggedItem(flaggedData);
    res.status(201).json(newFlagged);
  } catch (error) {
    res.status(500).json({ message: 'Error flagging response', error: error.message });
  }
};

export const editFlagged = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateFlaggedItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Flagged item not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating flagged item', error: error.message });
  }
};

export const removeFlagged = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteFlaggedItem(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Flagged item not found' });
    }
    res.status(200).json({ message: 'Flagged item resolved/deleted', item: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting flagged item', error: error.message });
  }
};
