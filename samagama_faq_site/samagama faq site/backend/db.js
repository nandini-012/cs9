import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localDbPath = path.resolve(__dirname, 'db.json');

let isMongoConnected = false;

// Mongoose Schemas
const faqSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  categoryIndex: String,
  category: String,
  question: String,
  answer: String
});

const internSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'student' },
  name: String,
  joinedDate: String,
  status: {
    phase: String,
    bronzeStatus: String,
    silverStatus: String,
    goldStatus: String,
    platinumStatus: String
  },
  internshipDates: {
    start: String,
    end: String,
    isConfirmed: Boolean
  },
  noc: {
    status: String,
    fileName: String,
    uploadDate: String,
    verificationDate: String,
    isEmailForwardPath: Boolean
  },
  offerLetter: {
    status: String,
    type: String,
    downloadUrl: String,
    issuedDate: String,
    acceptedDate: String
  },
  vibeEmail: String,
  exemptions: {
    mernStack: Boolean,
    coursework: Boolean
  },
  escalations: [
    {
      timestamp: String,
      message: String,
      resolved: Boolean
    }
  ]
});

// Avoid OverwriteModelError in case of multiple compilations
const FaqModel = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
const InternModel = mongoose.models.Intern || mongoose.model('Intern', internSchema);

const leaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  score: Number,
  isCurrentUser: Boolean,
  avatarInitials: String,
  colorClass: String
});

const LeaderboardModel = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);

const querySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  upvotes: { type: Number, default: 0 },
  categories: [String],
  category: String,
  time: String,
  date: String,
  title: String,
  excerpt: String,
  description: String,
  comments: { type: Number, default: 0 },
  status: String,
  upvoted: { type: Boolean, default: false },
  isUpvoted: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
  authorEmail: String,
  authorName: String,
  author: String,
  resolverName: String,
  tags: [String],
  timeline: [
    {
      label: String,
      date: String,
      status: String,
      isHighPriority: Boolean
    }
  ],
  officialResponse: {
    author: String,
    role: String,
    date: String,
    text: String,
    helpfulCount: { type: Number, default: 0 },
    isHelpfulClicked: { type: Boolean, default: false },
    isMarkedSolution: { type: Boolean, default: false }
  },
  attachmentName: String
});

const QueryModel = mongoose.models.Query || mongoose.model('Query', querySchema);

const flaggedSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  queryId: String,
  reason: String,
  flaggedBy: String,
  responseAuthor: String,
  responseText: String,
  date: String,
  isEditing: { type: Boolean, default: false },
  editText: String
});

const FlaggedModel = mongoose.models.Flagged || mongoose.model('Flagged', flaggedSchema);

const defaultQueries = [
  {
    id: 'q-1',
    upvotes: 124,
    categories: ['ABOUT', 'GENERAL'],
    category: 'ABOUT',
    time: '2 hours ago',
    date: 'OCT 26, 09:30 AM',
    title: 'What is the Vicharanashala internship?',
    excerpt: 'It is a research-oriented program where students work on real-world projects under faculty guidance. It offers exposure to cutting-edge technologies and scientific methodologies.',
    description: 'It is a research-oriented program where students work on real-world projects under faculty guidance. It offers exposure to cutting-edge technologies and scientific methodologies.',
    comments: 42,
    status: 'Active',
    upvoted: false,
    isUpvoted: false,
    isResolved: false,
    authorEmail: 'admin@samagama.in',
    authorName: 'Administration',
    author: 'Administration',
    tags: ['INFO'],
    timeline: [
      { label: 'Submitted', date: 'OCT 26, 09:30 AM', status: 'completed' },
      { label: 'Resolved', date: 'OCT 26, 11:30 AM', status: 'completed' }
    ]
  },
  {
    id: '4829',
    upvotes: 122,
    categories: ['NOC'],
    category: 'NOC',
    time: '5 hours ago',
    date: 'OCT 12, 10:45 AM',
    title: 'When do I submit the NOC?',
    excerpt: 'The No Objection Certificate must be submitted within 7 days of receiving the initial selection email to confirm your placement in the lab.',
    description: "I'm currently finalizing my internship paperwork and need clarity on the No Objection Certificate (NOC) submission. Is there a specific deadline for the current session, or can it be submitted along with the final report?",
    comments: 18,
    status: 'In Progress',
    upvoted: false,
    isUpvoted: false,
    isResolved: false,
    authorEmail: 'student@samagama.in',
    authorName: 'Student #1234',
    author: 'Student #1234',
    tags: ['LIBRARY ACCESS'],
    timeline: [
      { label: 'Submitted', date: 'OCT 12, 10:45 AM', status: 'completed' },
      { label: "Peer's Resolving", date: null, status: 'failed' },
      { label: 'Escalated to Admin', date: 'UPDATED RECENTLY', status: 'active', isHighPriority: true },
      { label: 'Resolved', date: 'Awaiting user confirmation', status: 'pending' }
    ],
    officialResponse: {
      author: 'Office of the Registrar (ADMIN)',
      role: 'OFFICIAL RESPONSE',
      date: 'UPDATED MOMENTS AGO',
      text: 'Dear Student, The deadline is not hard — there is no specific cut-off date. However, to ensure seamless processing of your stipend and formal records, you should submit it as early as possible. We recommend completing the submission at least 15 days before the internship completion date.',
      helpfulCount: 88,
      isHelpfulClicked: false,
      isMarkedSolution: false
    }
  },
  {
    id: 'q-3',
    upvotes: 56,
    categories: ['SELECTION'],
    category: 'SELECTION',
    time: 'Yesterday',
    date: 'OCT 25, 02:15 PM',
    title: 'How do I receive my offer letter and certificate?',
    excerpt: 'Offer letters are sent via email. Certificates are issued upon successful completion of the internship and submission of the final project report.',
    description: 'Offer letters are sent via email. Certificates are issued upon successful completion of the internship and submission of the final project report.',
    comments: 9,
    status: 'Resolved',
    upvoted: false,
    isUpvoted: false,
    isResolved: true,
    authorEmail: 'hr@samagama.in',
    authorName: 'HR Department',
    author: 'HR Department',
    tags: ['CERTIFICATE'],
    timeline: [
      { label: 'Submitted', date: 'OCT 25, 02:15 PM', status: 'completed' },
      { label: 'Resolved', date: 'OCT 25, 05:00 PM', status: 'completed' }
    ]
  },
  {
    id: 'q-similar-noc-verification',
    upvotes: 75,
    categories: ['NOC'],
    category: 'NOC',
    time: '3 days ago',
    date: 'OCT 23, 11:00 AM',
    title: 'NOC verification timeline and status pending',
    excerpt: 'NOC verification takes 3–5 working days. If it has been longer, you can check with the administration or verify if your file upload was clear.',
    description: 'NOC verification takes 3–5 working days. If it has been longer, you can check with the administration or verify if your file upload was clear.',
    comments: 3,
    status: 'Resolved',
    upvoted: false,
    isUpvoted: false,
    isResolved: true,
    authorEmail: 'student.noc@samagama.in',
    authorName: 'Student #5892',
    author: 'Student #5892',
    tags: ['NOC', 'VERIFICATION'],
    timeline: [
      { label: 'Submitted', date: 'OCT 23, 11:00 AM', status: 'completed' },
      { label: 'Resolved', date: 'OCT 24, 02:00 PM', status: 'completed' }
    ]
  },
  {
    id: 'q-similar-stipend-amount',
    upvotes: 98,
    categories: ['STIPEND'],
    category: 'STIPEND',
    time: '4 days ago',
    date: 'OCT 22, 09:00 AM',
    title: 'What is the monthly stipend amount and when is it credited?',
    excerpt: 'Stipend details are specified in your offer letter. Credits are processed in the first week of the subsequent month.',
    description: 'Stipend details are specified in your offer letter. Credits are processed in the first week of the subsequent month.',
    comments: 7,
    status: 'Resolved',
    upvoted: false,
    isUpvoted: false,
    isResolved: true,
    authorEmail: 'student.stipend2@samagama.in',
    authorName: 'Student #7492',
    author: 'Student #7492',
    tags: ['STIPEND', 'FINANCE'],
    timeline: [
      { label: 'Submitted', date: 'OCT 22, 09:00 AM', status: 'completed' },
      { label: 'Resolved', date: 'OCT 22, 04:00 PM', status: 'completed' }
    ]
  },
  {
    id: 'q-similar-team-size',
    upvotes: 43,
    categories: ['GENERAL'],
    category: 'GENERAL',
    time: '2 days ago',
    date: 'OCT 24, 03:30 PM',
    title: 'Can I form a team with students from my own college?',
    excerpt: 'No. Teams must consist of members from different institutions to encourage networking across cohorts, except for different campuses of the same college.',
    description: 'No. Teams must consist of members from different institutions to encourage networking across cohorts, except for different campuses of the same college.',
    comments: 14,
    status: 'Resolved',
    upvoted: false,
    isUpvoted: false,
    isResolved: true,
    authorEmail: 'student.team@samagama.in',
    authorName: 'Student #4102',
    author: 'Student #4102',
    tags: ['TEAM', 'COLLABORATION'],
    timeline: [
      { label: 'Submitted', date: 'OCT 24, 03:30 PM', status: 'completed' },
      { label: 'Resolved', date: 'OCT 25, 10:00 AM', status: 'completed' }
    ]
  },
  {
    id: 'q-similar-team-inactive',
    upvotes: 62,
    categories: ['GENERAL'],
    category: 'GENERAL',
    time: '4 days ago',
    date: 'OCT 22, 08:15 AM',
    title: 'What happens if a team member is inactive or not contributing?',
    excerpt: 'You should report the issue to your mentor/scholar early. Prolonged inactivity may lead to administrative intervention or team adjustment.',
    description: 'You should report the issue to your mentor/scholar early. Prolonged inactivity may lead to administrative intervention or team adjustment.',
    comments: 11,
    status: 'Resolved',
    upvoted: false,
    isUpvoted: false,
    isResolved: true,
    authorEmail: 'student.inactive@samagama.in',
    authorName: 'Student #2819',
    author: 'Student #2819',
    tags: ['TEAM', 'EVALUATION'],
    timeline: [
      { label: 'Submitted', date: 'OCT 22, 08:15 AM', status: 'completed' },
      { label: 'Resolved', date: 'OCT 22, 05:00 PM', status: 'completed' }
    ]
  },
  {
    id: 'q-similar-whatsapp-group',
    upvotes: 145,
    categories: ['GENERAL'],
    category: 'GENERAL',
    time: '5 days ago',
    date: 'OCT 21, 10:00 AM',
    title: 'Can we create a WhatsApp group for our team project?',
    excerpt: 'No. WhatsApp is not encouraged for project coordination. Creating team WhatsApp groups violates the communication policy and can lead to termination.',
    description: 'No. WhatsApp is not encouraged for project coordination. Creating team WhatsApp groups violates the communication policy and can lead to termination.',
    comments: 28,
    status: 'Resolved',
    upvoted: false,
    isUpvoted: false,
    isResolved: true,
    authorEmail: 'student.policy@samagama.in',
    authorName: 'Student #9273',
    author: 'Student #9273',
    tags: ['COMMUNICATION', 'POLICY'],
    timeline: [
      { label: 'Submitted', date: 'OCT 21, 10:00 AM', status: 'completed' },
      { label: 'Resolved', date: 'OCT 21, 01:00 PM', status: 'completed' }
    ]
  },
  {
    id: 'q-similar-stipend-noc',
    upvotes: 112,
    categories: ['STIPEND'],
    category: 'STIPEND',
    time: '1 week ago',
    date: 'OCT 19, 11:30 AM',
    title: 'Is stipend processing linked to NOC document submission?',
    excerpt: 'Yes. To ensure seamless processing of your stipend and formal records, you should submit your NOC document at least 15 days before completion.',
    description: 'Yes. To ensure seamless processing of your stipend and formal records, you should submit your NOC document at least 15 days before completion.',
    comments: 19,
    status: 'Resolved',
    upvoted: false,
    isUpvoted: false,
    isResolved: true,
    authorEmail: 'student.stipend@samagama.in',
    authorName: 'Student #8401',
    author: 'Student #8401',
    tags: ['STIPEND', 'NOC'],
    timeline: [
      { label: 'Submitted', date: 'OCT 19, 11:30 AM', status: 'completed' },
      { label: 'Resolved', date: 'OCT 20, 11:00 AM', status: 'completed' }
    ]
  }
];

const defaultFlaggedItems = [
  {
    id: 'f-1',
    queryId: '8531',
    reason: 'The contact info in the response is incorrect and should be corrected.',
    flaggedBy: 'Anish M',
    responseAuthor: 'Rohan Malhotra',
    responseText: 'You can reach the IIT Ropar internship coordinator at registrar-office@iitrpr.ac.in (direct extension 4201).',
    date: '2 hours ago',
    isEditing: false,
    editText: 'You can reach the IIT Ropar internship coordinator at registrar-office@iitrpr.ac.in (direct extension 4201).'
  },
  {
    id: 'f-2',
    queryId: '9102',
    reason: 'This answer contains outdated stipend rates.',
    flaggedBy: 'Sarah J',
    responseAuthor: 'Udharsh Goyal',
    responseText: 'Stipends are credited by the 28th of every month. The current rate is 8,000 INR per month.',
    date: '5 hours ago',
    isEditing: false,
    editText: 'Stipends are credited by the 28th of every month. The current rate is 8,000 INR per month.'
  }
];

// Fallback JSON-based Database helper
let cachedFaqs = null;

class LocalDb {
  constructor() {
    this.data = { faqs: [], interns: [], leaderboard: [], queries: [], flagged: [] };
    this.internsMap = new Map();
    this.saving = false;
    this.savePending = false;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(localDbPath)) {
        const raw = fs.readFileSync(localDbPath, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.leaderboard) {
          this.data.leaderboard = [];
        }
        if (!this.data.queries || this.data.queries.length === 0) {
          this.data.queries = defaultQueries;
          this.save();
        }
        if (!this.data.flagged || this.data.flagged.length === 0) {
          this.data.flagged = defaultFlaggedItems;
          this.save();
        }
        // Build map for O(1) lookups and ensure password/role seeding
        this.internsMap = new Map();
        if (Array.isArray(this.data.interns)) {
          let modified = false;
          const salt = bcrypt.genSaltSync(10);
          const defaultHash = bcrypt.hashSync('password123', salt);
          const adminHash = bcrypt.hashSync('admin123', salt);

          // Seed admin@hotmail.com if not exists
          const adminExists = this.data.interns.some(i => i.email.toLowerCase().trim() === 'admin@hotmail.com');
          if (!adminExists) {
            this.data.interns.push({
              email: 'admin@hotmail.com',
              passwordHash: adminHash,
              role: 'admin',
              name: 'Admin Moderator',
              joinedDate: new Date().toISOString().split('T')[0],
              status: {
                phase: 'Platinum',
                bronzeStatus: 'completed',
                silverStatus: 'completed',
                goldStatus: 'completed',
                platinumStatus: 'completed'
              },
              internshipDates: {
                start: '2026-05-01',
                end: '2026-07-01',
                isConfirmed: true
              },
              noc: { status: 'verified', fileName: '', uploadDate: '', verificationDate: '', isEmailForwardPath: false },
              offerLetter: { status: 'accepted', type: 'formal', downloadUrl: '', issuedDate: '', acceptedDate: '' },
              vibeEmail: 'admin@hotmail.com',
              exemptions: { mernStack: true, coursework: true },
              escalations: []
            });
            modified = true;
          }

          this.data.interns.forEach(intern => {
            if (intern && intern.email) {
              const normEmail = intern.email.toLowerCase().trim();
              if (!intern.passwordHash) {
                intern.passwordHash = normEmail.includes('@hotmail') ? adminHash : defaultHash;
                modified = true;
              }
              if (!intern.role) {
                intern.role = normEmail.includes('@hotmail') ? 'admin' : 'student';
                modified = true;
              }
              this.internsMap.set(normEmail, intern);
            }
          });

          if (modified) {
            this.save();
          }
        }
      } else {
        this.data = {
          faqs: [],
          interns: [],
          leaderboard: [],
          queries: defaultQueries,
          flagged: defaultFlaggedItems
        };
        this.save();
      }
    } catch (e) {
      console.error("Failed to load local DB, using defaults:", e);
    }
  }

  async save() {
    if (this.saving) {
      this.savePending = true;
      return;
    }
    this.saving = true;
    try {
      const tempPath = localDbPath + '.tmp';
      await fs.promises.writeFile(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      await fs.promises.rename(tempPath, localDbPath);
    } catch (e) {
      console.error("Failed to write to local DB:", e);
    } finally {
      this.saving = false;
      if (this.savePending) {
        this.savePending = false;
        await this.save();
      }
    }
  }
}

const localDb = new LocalDb();

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log("No MONGO_URI specified in env. Using local JSON database fallback.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log("Successfully connected to MongoDB!");

    // Seed FAQs from db.json if database is empty
    const faqCount = await FaqModel.countDocuments();
    if (faqCount === 0 && localDb.data.faqs.length > 0) {
      console.log("Seeding FAQs from local db.json to MongoDB...");
      await FaqModel.insertMany(localDb.data.faqs);
      console.log(`Seeded ${localDb.data.faqs.length} FAQs to MongoDB.`);
    }

    // Seed Interns if empty
    const internCount = await InternModel.countDocuments();
    if (internCount === 0 && localDb.data.interns.length > 0) {
      console.log("Seeding interns to MongoDB...");
      await InternModel.insertMany(localDb.data.interns);
    } else if (internCount > 0) {
      // Ensure all MongoDB interns have a passwordHash and role
      const internsInMongo = await InternModel.find();
      const salt = bcrypt.genSaltSync(10);
      const defaultHash = bcrypt.hashSync('password123', salt);
      const adminHash = bcrypt.hashSync('admin123', salt);

      for (let intern of internsInMongo) {
        let changed = false;
        if (!intern.passwordHash) {
          intern.passwordHash = intern.email.toLowerCase().includes('@hotmail') ? adminHash : defaultHash;
          changed = true;
        }
        if (!intern.role) {
          intern.role = intern.email.toLowerCase().includes('@hotmail') ? 'admin' : 'student';
          changed = true;
        }
        if (changed) {
          await intern.save();
        }
      }

      // Ensure admin@hotmail.com is in MongoDB
      const adminInMongo = await InternModel.findOne({ email: 'admin@hotmail.com' });
      if (!adminInMongo && localDb.data.interns.length > 0) {
        const adminRecord = localDb.data.interns.find(i => i.email === 'admin@hotmail.com');
        if (adminRecord) {
          await InternModel.create(adminRecord);
        }
      }
    }

    // Seed Leaderboard if empty
    const leaderboardCount = await LeaderboardModel.countDocuments();
    if (leaderboardCount === 0 && localDb.data.leaderboard && localDb.data.leaderboard.length > 0) {
      console.log("Seeding leaderboard to MongoDB...");
      await LeaderboardModel.insertMany(localDb.data.leaderboard);
    }

    // Seed Queries if empty
    const queryCount = await QueryModel.countDocuments();
    if (queryCount === 0 && localDb.data.queries && localDb.data.queries.length > 0) {
      console.log("Seeding queries to MongoDB...");
      await QueryModel.insertMany(localDb.data.queries);
    }

    // Seed Flagged if empty
    const flaggedCount = await FlaggedModel.countDocuments();
    if (flaggedCount === 0 && localDb.data.flagged && localDb.data.flagged.length > 0) {
      console.log("Seeding flagged items to MongoDB...");
      await FlaggedModel.insertMany(localDb.data.flagged);
    }

    cachedFaqs = null;
    return true;
  } catch (err) {
    console.log("MongoDB connection failed or timed out. Falling back to local JSON database.");
    isMongoConnected = false;
    return false;
  }
}

// Unified API layer
export async function getFAQs() {
  if (cachedFaqs) {
    return cachedFaqs;
  }
  if (isMongoConnected) {
    cachedFaqs = await FaqModel.find().lean();
    return cachedFaqs;
  } else {
    cachedFaqs = localDb.data.faqs;
    return cachedFaqs;
  }
}

export async function getInternByEmail(email) {
  if (!email) return null;
  const normEmail = email.toLowerCase().trim();
  if (isMongoConnected) {
    return await InternModel.findOne({ email: normEmail });
  } else {
    return localDb.internsMap.get(normEmail) || null;
  }
}

export async function createIntern(internData) {
  const normEmail = internData.email.toLowerCase().trim();
  const dataToSave = { ...internData, email: normEmail };
  if (isMongoConnected) {
    const newIntern = new InternModel(dataToSave);
    return await newIntern.save();
  } else {
    const index = localDb.data.interns.findIndex(i => i.email.toLowerCase().trim() === normEmail);
    if (index >= 0) {
      localDb.data.interns[index] = dataToSave;
    } else {
      localDb.data.interns.push(dataToSave);
    }
    localDb.internsMap.set(normEmail, dataToSave);
    localDb.save();
    return dataToSave;
  }
}

export async function updateIntern(email, updateFields) {
  const normEmail = email.toLowerCase().trim();
  if (isMongoConnected) {
    return await InternModel.findOneAndUpdate(
      { email: normEmail },
      { $set: updateFields },
      { new: true }
    );
  } else {
    const existing = localDb.internsMap.get(normEmail);
    if (existing) {
      // Helper to merge nested objects
      const merge = (target, source) => {
        for (const key in source) {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            target[key] = target[key] || {};
            merge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      };
      merge(existing, updateFields);
      localDb.save();
      return existing;
    }
    return null;
  }
}

export async function getLeaderboard() {
  if (isMongoConnected) {
    return await LeaderboardModel.find().lean();
  } else {
    return localDb.data.leaderboard || [];
  }
}

export async function updateLeaderboardScore(name, score) {
  if (isMongoConnected) {
    return await LeaderboardModel.findOneAndUpdate(
      { name: name },
      { $set: { score: score } },
      { new: true }
    );
  } else {
    const list = localDb.data.leaderboard || [];
    const item = list.find(l => l.name === name);
    if (item) {
      item.score = score;
      localDb.save();
      return item;
    }
    return null;
  }
}

export async function createFAQ(faqData) {
  if (isMongoConnected) {
    const newFaq = new FaqModel(faqData);
    return await newFaq.save();
  } else {
    localDb.data.faqs.push(faqData);
    localDb.save();
    cachedFaqs = null;
    return faqData;
  }
}

export async function updateFAQ(id, updateFields) {
  if (isMongoConnected) {
    return await FaqModel.findOneAndUpdate(
      { id: id },
      { $set: updateFields },
      { new: true }
    );
  } else {
    const existing = localDb.data.faqs.find(f => f.id === id);
    if (existing) {
      Object.assign(existing, updateFields);
      localDb.save();
      cachedFaqs = null;
      return existing;
    }
    return null;
  }
}

export async function deleteFAQ(id) {
  if (isMongoConnected) {
    return await FaqModel.findOneAndDelete({ id: id });
  } else {
    const index = localDb.data.faqs.findIndex(f => f.id === id);
    if (index >= 0) {
      const deleted = localDb.data.faqs.splice(index, 1)[0];
      localDb.save();
      cachedFaqs = null;
      return deleted;
    }
    return null;
  }
}

// Query helpers
export async function getQueries() {
  if (isMongoConnected) {
    return await QueryModel.find().lean();
  } else {
    return localDb.data.queries || [];
  }
}

export async function createQuery(queryData) {
  if (isMongoConnected) {
    const newQuery = new QueryModel(queryData);
    return await newQuery.save();
  } else {
    localDb.data.queries.push(queryData);
    localDb.save();
    return queryData;
  }
}

export async function updateQuery(id, updateFields) {
  if (isMongoConnected) {
    return await QueryModel.findOneAndUpdate(
      { id: id },
      { $set: updateFields },
      { new: true }
    );
  } else {
    const existing = localDb.data.queries.find(q => q.id === id);
    if (existing) {
      // Custom merge for officialResponse and timeline
      if (updateFields.officialResponse) {
        existing.officialResponse = { ...existing.officialResponse, ...updateFields.officialResponse };
      }
      Object.keys(updateFields).forEach(key => {
        if (key !== 'officialResponse') {
          existing[key] = updateFields[key];
        }
      });
      localDb.save();
      return existing;
    }
    return null;
  }
}

export async function deleteQuery(id) {
  if (isMongoConnected) {
    return await QueryModel.findOneAndDelete({ id: id });
  } else {
    const index = localDb.data.queries.findIndex(q => q.id === id);
    if (index >= 0) {
      const deleted = localDb.data.queries.splice(index, 1)[0];
      localDb.save();
      return deleted;
    }
    return null;
  }
}

// Flagged helpers
export async function getFlaggedItems() {
  if (isMongoConnected) {
    return await FlaggedModel.find().lean();
  } else {
    return localDb.data.flagged || [];
  }
}

export async function createFlaggedItem(flaggedData) {
  if (isMongoConnected) {
    const newFlagged = new FlaggedModel(flaggedData);
    return await newFlagged.save();
  } else {
    localDb.data.flagged.push(flaggedData);
    localDb.save();
    return flaggedData;
  }
}

export async function updateFlaggedItem(id, updateFields) {
  if (isMongoConnected) {
    return await FlaggedModel.findOneAndUpdate(
      { id: id },
      { $set: updateFields },
      { new: true }
    );
  } else {
    const existing = localDb.data.flagged.find(f => f.id === id);
    if (existing) {
      Object.assign(existing, updateFields);
      localDb.save();
      return existing;
    }
    return null;
  }
}

export async function deleteFlaggedItem(id) {
  if (isMongoConnected) {
    return await FlaggedModel.findOneAndDelete({ id: id });
  } else {
    const index = localDb.data.flagged.findIndex(f => f.id === id);
    if (index >= 0) {
      const deleted = localDb.data.flagged.splice(index, 1)[0];
      localDb.save();
      return deleted;
    }
    return null;
  }
}

