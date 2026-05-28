import { getInternByEmail, createIntern, updateIntern, getLeaderboard, updateLeaderboardScore } from '../db.js';

// Get profile by email (auto-registers new email for mock testing)
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// Confirm dates
export const confirmDates = async (req, res) => {
  try {
    const email = req.user.email;
    const { start, end } = req.body;
    if (!start || !end) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    // Validation
    const endDate = new Date(end);
    const deadline = new Date("2026-12-31");
    if (endDate > deadline) {
      return res.status(400).json({ message: "Validation Error: Internship must finish on or before 31 December 2026." });
    }

    const startDate = new Date(start);
    if (startDate >= endDate) {
      return res.status(400).json({ message: "Validation Error: Start date must be before end date." });
    }

    // Check duration (standard is 2 months)
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 45) {
      return res.status(400).json({ message: "Validation Error: Minimum internship duration is 45 days (approx. 2 months)." });
    }

    const intern = await getInternByEmail(email);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // Update dates
    const datesUpdate = {
      "internshipDates.start": start,
      "internshipDates.end": end,
      "internshipDates.isConfirmed": true
    };

    // Calculate new offer letter status based on NOC state
    let offerStatus = intern.offerLetter.status;
    let offerType = intern.offerLetter.type;

    if (intern.noc.status === 'verified') {
      offerStatus = "available_formal";
      offerType = "formal";
    } else if (intern.noc.status === 'uploaded') {
      offerStatus = "available_provisional";
      offerType = "provisional";
    }

    const updated = await updateIntern(email, {
      ...datesUpdate,
      "offerLetter.status": offerStatus,
      "offerLetter.type": offerType,
      "offerLetter.issuedDate": offerStatus !== "locked" && !intern.offerLetter.issuedDate ? new Date().toISOString().split('T')[0] : intern.offerLetter.issuedDate
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error confirming dates:", error);
    return res.status(500).json({ message: "Failed to confirm dates" });
  }
};

// Upload NOC
export const uploadNoc = async (req, res) => {
  try {
    const email = req.user.email;

    const intern = await getInternByEmail(email);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = req.file ? req.file.originalname : "noc_document.pdf";

    // Update NOC status to 'uploaded'
    // To make it immediately interactive, we will auto-verify the NOC after 2 seconds, but start by marking it 'uploaded'
    let nocUpdate = {
      noc: {
        status: "uploaded",
        fileName: fileName,
        uploadDate: dateStr,
        verificationDate: "",
        isEmailForwardPath: false
      }
    };

    // Check if dates are already confirmed
    let offerStatus = "locked";
    let offerType = "none";
    if (intern.internshipDates.isConfirmed) {
      offerStatus = "available_provisional";
      offerType = "provisional";
    }

    const updated = await updateIntern(email, {
      ...nocUpdate,
      "offerLetter.status": offerStatus,
      "offerLetter.type": offerType,
      "offerLetter.issuedDate": offerStatus !== "locked" ? dateStr : ""
    });

    // Simulate background admin verification of NOC (auto-verifies in 3 seconds)
    setTimeout(async () => {
      const currentIntern = await getInternByEmail(email);
      if (currentIntern && currentIntern.noc.status === "uploaded") {
        const verifyDate = new Date().toISOString().split('T')[0];
        let nextOfferStatus = currentIntern.offerLetter.status;
        let nextOfferType = currentIntern.offerLetter.type;

        if (currentIntern.internshipDates.isConfirmed) {
          nextOfferStatus = "available_formal";
          nextOfferType = "formal";
        }

        await updateIntern(email, {
          "noc.status": "verified",
          "noc.verificationDate": verifyDate,
          "offerLetter.status": nextOfferStatus,
          "offerLetter.type": nextOfferType,
          "offerLetter.issuedDate": nextOfferStatus !== "locked" && !currentIntern.offerLetter.issuedDate ? verifyDate : currentIntern.offerLetter.issuedDate
        });
        console.log(`Auto-verified NOC for ${email}`);
      }
    }, 4000);

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error uploading NOC:", error);
    return res.status(500).json({ message: "Failed to upload NOC" });
  }
};

// Upload Self-Declaration (Provisional pathway)
export const uploadSelfDeclaration = async (req, res) => {
  try {
    const email = req.user.email;

    const intern = await getInternByEmail(email);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    const dateStr = new Date().toISOString().split('T')[0];
    
    // Self declaration issues a provisional status
    let nocUpdate = {
      "noc.status": "uploaded", // uploaded represents provisional check
      "noc.fileName": "Self_Declaration.txt",
      "noc.uploadDate": dateStr,
      "noc.isEmailForwardPath": false
    };

    let offerStatus = "locked";
    let offerType = "none";
    if (intern.internshipDates.isConfirmed) {
      offerStatus = "available_provisional";
      offerType = "provisional";
    }

    const updated = await updateIntern(email, {
      ...nocUpdate,
      "offerLetter.status": offerStatus,
      "offerLetter.type": offerType,
      "offerLetter.issuedDate": offerStatus !== "locked" ? dateStr : ""
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error saving self-declaration:", error);
    return res.status(500).json({ message: "Failed to submit self-declaration" });
  }
};

// NOC Email Forward Mock Path
export const nocEmailForward = async (req, res) => {
  try {
    const email = req.user.email;

    const dateStr = new Date().toISOString().split('T')[0];
    const intern = await getInternByEmail(email);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    let offerStatus = intern.offerLetter.status;
    let offerType = intern.offerLetter.type;
    if (intern.internshipDates.isConfirmed) {
      offerStatus = "available_formal";
      offerType = "formal";
    }

    const updated = await updateIntern(email, {
      "noc.status": "verified",
      "noc.fileName": "HOD_Email_Forward",
      "noc.uploadDate": dateStr,
      "noc.verificationDate": dateStr,
      "noc.isEmailForwardPath": true,
      "offerLetter.status": offerStatus,
      "offerLetter.type": offerType,
      "offerLetter.issuedDate": offerStatus !== "locked" ? dateStr : ""
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error triggering email path:", error);
    return res.status(500).json({ message: "Failed to process email path" });
  }
};

// Accept Offer Letter
export const acceptOffer = async (req, res) => {
  try {
    const email = req.user.email;
    const { acceptanceText } = req.body;
    if (!acceptanceText) {
      return res.status(400).json({ message: "Acceptance text is required" });
    }

    const intern = await getInternByEmail(email);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // Clean comparison
    // Standard text: I, [Full Name], confirm that I have read, understood, and accepted all terms, conditions, and obligations set out in this offer letter and in the program FAQ at samagama.in. I formally accept the offer of Summer Internship 2026.
    const cleanInput = acceptanceText.replace(/\s+/g, ' ').trim().toLowerCase();
    const name = intern.name.toLowerCase().trim();
    
    // We expect the student to put their name in [Full Name] or replace it.
    // Let's check if the text contains key compliance clauses:
    const containsName = cleanInput.includes(name);
    const containsTerms = cleanInput.includes("terms, conditions, and obligations");
    const containsFaq = cleanInput.includes("faq at samagama.in");
    const containsAccept = cleanInput.includes("formally accept the offer of summer internship 2026");

    if (!containsTerms || !containsFaq || !containsAccept) {
      return res.status(400).json({ 
        message: "WITHDRAWAL WARNING: Non-compliant acceptance format. You must copy and paste the statement exactly as printed, with your full name inserted and date added. Modifying or paraphrasing the statement will cause immediate withdrawal of the offer." 
      });
    }

    // If it passes attention to detail check, set state to accepted!
    const dateStr = new Date().toISOString().split('T')[0];
    const updated = await updateIntern(email, {
      "offerLetter.status": "accepted",
      "offerLetter.acceptedDate": dateStr,
      "status.bronzeStatus": "completed", // Completing acceptance transitions to silver phase (Bronze done)
      "status.silverStatus": "in-progress"
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error accepting offer:", error);
    return res.status(500).json({ message: "Failed to accept offer" });
  }
};

// Custom escalation command handling
export const submitEscalation = async (req, res) => {
  try {
    const email = req.user.email;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const intern = await getInternByEmail(email);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    const escalationItem = {
      timestamp: new Date().toISOString(),
      message: message,
      resolved: false
    };

    const updated = await updateIntern(email, {
      escalations: [...intern.escalations, escalationItem]
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error submitting escalation:", error);
    return res.status(500).json({ message: "Failed to submit escalation" });
  }
};

// Get full leaderboard data
export const getLeaderboardData = async (req, res) => {
  try {
    const list = await getLeaderboard();
    return res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return res.status(500).json({ message: "Failed to fetch leaderboard data" });
  }
};

// Update leaderboard score for a user
export const updateLeaderboard = async (req, res) => {
  try {
    const { name, score } = req.body;
    if (!name || score === undefined) {
      return res.status(400).json({ message: "Name and score are required" });
    }
    const updatedItem = await updateLeaderboardScore(name, score);
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return res.status(500).json({ message: "Failed to update leaderboard" });
  }
};
