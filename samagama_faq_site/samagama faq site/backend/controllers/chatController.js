import { getFAQs, getInternByEmail, updateIntern } from '../db.js';

export const handleChatMessage = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required to chat with Yaksha" });
    }

    const normEmail = email.toLowerCase().trim();
    const cleanMsg = message.trim();
    const lowerMsg = cleanMsg.toLowerCase();

    const intern = await getInternByEmail(normEmail);
    if (!intern) {
      return res.status(404).json({ message: "Intern profile not found" });
    }

    // 1. Check for command hashtags
    // Command: #vibe-email <gmail>
    if (lowerMsg.startsWith('#vibe-email')) {
      const match = cleanMsg.match(/#vibe-email\s+([^\s]+)/i);
      if (!match) {
        return res.status(200).json({
          sender: "Yaksha-mini",
          text: "Please provide your Gmail address after the tag, like: `#vibe-email student@gmail.com`."
        });
      }
      const vibeGmail = match[1].toLowerCase().trim();
      if (!vibeGmail.includes('@') || !vibeGmail.endsWith('.com')) {
        return res.status(200).json({
          sender: "Yaksha-mini",
          text: "Invalid email format. Please specify a valid Gmail address."
        });
      }
      await updateIntern(normEmail, { vibeEmail: vibeGmail });
      return res.status(200).json({
        sender: "Yaksha-mini",
        text: `✅ Thank you! I have linked your ViBe email address: **${vibeGmail}** to your internship record. It will sync within 1 hour.`
      });
    }

    // Command: #exemption from mern stack course
    if (lowerMsg.includes('#exemption from mern stack course')) {
      await updateIntern(normEmail, { "exemptions.mernStack": true });
      return res.status(200).json({
        sender: "Yaksha-mini",
        text: "✅ Exemption request logged! Your prior completion of the MERN Stack coursework with VLED has been registered. You are exempt from the MERN coursework. Please note: the new **AI Fundamentals** course is still mandatory."
      });
    }

    // Command: #exemption from coursework
    if (lowerMsg.includes('#exemption from coursework')) {
      return res.status(200).json({
        sender: "Yaksha-mini",
        text: "❌ Exemption Denied: The viva-route coursework exemption is not available to returning interns. Since AI Fundamentals contains completely new content, all interns must complete it to progress."
      });
    }

    // Command: #escalate-vibe
    if (lowerMsg.startsWith('#escalate-vibe') || lowerMsg.startsWith('#escalate-vibe')) {
      const escalationMsg = cleanMsg.replace(/#escalate-vibe/i, '').trim();
      if (!escalationMsg) {
        return res.status(200).json({
          sender: "Yaksha-mini",
          text: "Please describe your ViBe issue after the `#escalate-ViBe` tag so our technical team can help you."
        });
      }
      const newEscalations = [...intern.escalations, {
        timestamp: new Date().toISOString(),
        message: `[ViBe Issue] ${escalationMsg}`,
        resolved: false
      }];
      await updateIntern(normEmail, { escalations: newEscalations });
      return res.status(200).json({
        sender: "Yaksha-mini",
        text: "🚨 Escalation Registered: Your ViBe platform technical issue has been logged. Our technical TAs will review the logs for your account and get back to you by email within 2 hours."
      });
    }

    // Command: #escalate
    if (lowerMsg.startsWith('#escalate')) {
      const escalationMsg = cleanMsg.replace(/#escalate/i, '').trim();
      if (!escalationMsg) {
        return res.status(200).json({
          sender: "Yaksha-mini",
          text: "Please write your specific query after the `#escalate` tag so our scholars can review it."
        });
      }
      const newEscalations = [...intern.escalations, {
        timestamp: new Date().toISOString(),
        message: escalationMsg,
        resolved: false
      }];
      await updateIntern(normEmail, { escalations: newEscalations });
      return res.status(200).json({
        sender: "Yaksha-mini",
        text: "🚨 Escalation Registered: Your query has been forwarded to Sudarshan Iyengar & the scholar team. We will review your profile details and respond on your registered email address within 24 hours."
      });
    }

    // 2. Perform FAQ Lookup
    const faqs = await getFAQs();
    const query = lowerMsg.trim();
    
    // Simple matching
    const scored = faqs.map(faq => {
      let score = 0;
      const question = faq.question.toLowerCase();
      const answer = faq.answer.replace(/<[^>]*>/g, '').toLowerCase(); // plain text for matching
      
      if (question.includes(query)) score += 50;
      if (answer.includes(query)) score += 15;
      
      const keywords = query.split(/\s+/).filter(k => k.length > 2);
      keywords.forEach(keyword => {
        if (question.includes(keyword)) score += 10;
        if (answer.includes(keyword)) score += 3;
      });
      
      return { ...faq, score };
    });

    const bestMatch = scored
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score)[0];

    // If we have a good match (score >= 15)
    if (bestMatch && bestMatch.score >= 15) {
      // Return the HTML answer
      return res.status(200).json({
        sender: "Yaksha-mini",
        text: `Here is the info I found in the FAQs: \n\n**${bestMatch.question}**\n\n${bestMatch.answer}\n\n*Reference: FAQ Section ${bestMatch.categoryIndex}*`
      });
    }

    // Default response
    return res.status(200).json({
      sender: "Yaksha-mini",
      text: "I couldn't find a direct answer in our FAQs for that. If your case is unique, please type **`#escalate`** followed by your query, and one of our research scholars will review and email you."
    });
  } catch (error) {
    console.error("Error in chat handler:", error);
    return res.status(500).json({ message: "Failed to process chat message" });
  }
};
