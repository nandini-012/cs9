import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../db.js';

export const getFaqs = async (req, res) => {
  try {
    const faqs = await getFAQs();
    return res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

export const searchFaqs = async (req, res) => {
  try {
    const { q } = req.query;
    const faqs = await getFAQs();
    
    if (!q || q.trim() === '') {
      return res.status(200).json(faqs);
    }

    const query = q.toLowerCase().trim();
    
    // Score matches
    const scoredFaqs = faqs.map(faq => {
      let score = 0;
      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();
      
      // Exact ID match
      if (faq.id === query) score += 100;
      
      // Question contains full query string
      if (question.includes(query)) score += 30;
      
      // Answer contains full query string
      if (answer.includes(query)) score += 10;
      
      // Split query into keywords
      const keywords = query.split(/\s+/).filter(k => k.length > 2);
      keywords.forEach(keyword => {
        if (question.includes(keyword)) score += 5;
        if (answer.includes(keyword)) score += 1;
      });

      return { ...faq, score };
    });

    // Filter out zero scores and sort by highest score
    const matches = scoredFaqs
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score);

    return res.status(200).json(matches);
  } catch (error) {
    console.error("Error searching FAQs:", error);
    return res.status(500).json({ message: "Failed to search FAQs" });
  }
};

export function convertPlainTextToHtml(text) {
  if (!text) return '';

  // If text already contains HTML-like tags (e.g. <p>, <ul>, <strong>, etc.), assume it is already formatted.
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text;
  }

  let cleaned = text.replace(/\r\n/g, '\n').trim();

  // Bold replacements: **text** -> <strong>text</strong>
  cleaned = cleaned.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');

  // URL replacements: http://... -> <a href="...">...</a>
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  cleaned = cleaned.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

  const lines = cleaned.split('\n');
  const result = [];
  
  let currentListType = null; // 'ul', 'ol', or null
  let currentListItems = [];

  const closeActiveList = () => {
    if (currentListType === 'ul') {
      result.push(`<ul>\n${currentListItems.map(item => `  <li>${item}</li>`).join('\n')}\n</ul>`);
    } else if (currentListType === 'ol') {
      result.push(`<ol>\n${currentListItems.map(item => `  <li>${item}</li>`).join('\n')}\n</ol>`);
    }
    currentListType = null;
    currentListItems = [];
  };

  let paragraphLines = [];

  const closeActiveParagraph = () => {
    if (paragraphLines.length > 0) {
      result.push(`<p>${paragraphLines.join('<br />')}</p>`);
      paragraphLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '') {
      // Empty line closes active paragraph and list groups
      closeActiveList();
      closeActiveParagraph();
      continue;
    }

    // Check for unordered list bullet point
    const ulMatch = line.match(/^[-*•]\s+(.*)$/);
    // Check for ordered list number
    const olMatch = line.match(/^\d+\.\s+(.*)$/);

    if (ulMatch) {
      closeActiveParagraph();
      if (currentListType !== 'ul') {
        closeActiveList();
        currentListType = 'ul';
      }
      currentListItems.push(ulMatch[1]);
    } else if (olMatch) {
      closeActiveParagraph();
      if (currentListType !== 'ol') {
        closeActiveList();
        currentListType = 'ol';
      }
      currentListItems.push(olMatch[1]);
    } else {
      // Normal text line
      closeActiveList();
      paragraphLines.push(line);
    }
  }

  // Close remaining open block groups
  closeActiveList();
  closeActiveParagraph();

  return result.join('\n');
}

export const addFaq = async (req, res) => {
  try {
    const { question, answer, category, categoryIndex } = req.body;
    if (!question || !answer || !category) {
      return res.status(400).json({ message: "Question, answer, and category are required" });
    }

    // Convert plain text to HTML automatically
    const formattedAnswer = convertPlainTextToHtml(answer);

    const id = 'faq-' + Date.now();
    const newFaq = {
      id,
      categoryIndex: categoryIndex || "9", // Default custom category index if not provided
      category,
      question,
      answer: formattedAnswer
    };

    const created = await createFAQ(newFaq);
    return res.status(201).json(created);
  } catch (error) {
    console.error("Error adding FAQ:", error);
    return res.status(500).json({ message: "Failed to add FAQ" });
  }
};

export const editFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, categoryIndex } = req.body;
    
    // Convert plain text to HTML automatically
    const formattedAnswer = convertPlainTextToHtml(answer);

    const updated = await updateFAQ(id, { 
      question, 
      answer: formattedAnswer, 
      category, 
      categoryIndex 
    });
    
    if (!updated) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error editing FAQ:", error);
    return res.status(500).json({ message: "Failed to edit FAQ" });
  }
};

export const removeFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteFAQ(id);
    if (!deleted) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    return res.status(200).json({ message: "FAQ deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return res.status(500).json({ message: "Failed to delete FAQ" });
  }
};

