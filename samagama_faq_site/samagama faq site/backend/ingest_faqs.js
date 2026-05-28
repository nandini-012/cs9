import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import UserModel from './models/User.js';
import QuestionModel from './models/Question.js';
import AnswerModel from './models/Answer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.resolve(__dirname, 'db.json');

// Connect to MONGO_URI in environment, fallback to localhost
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/samagama';

// Slugify helper
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

// Convert HTML tags to plain text for bodyPlain
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

async function run() {
  console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB!');

    // Read db.json
    if (!fs.existsSync(dbJsonPath)) {
      console.error(`db.json file not found at ${dbJsonPath}`);
      process.exit(1);
    }
    const raw = fs.readFileSync(dbJsonPath, 'utf8');
    const dbData = JSON.parse(raw);
    const faqs = dbData.faqs || [];
    console.log(`Loaded ${faqs.length} FAQs from db.json`);

    if (faqs.length === 0) {
      console.log('No FAQs to ingest.');
      process.exit(0);
    }

    // 1. Find or create Admin user in the users collection to be the author
    let admin = await UserModel.findOne({ role: 'ADMIN' });
    if (!admin) {
      console.log('No ADMIN user found in users collection. Creating a default ADMIN user...');
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('admin123', salt);
      admin = await UserModel.create({
        name: 'Admin Moderator',
        email: 'admin@hotmail.com',
        passwordHash,
        role: 'ADMIN'
      });
      console.log(`Default ADMIN user created with ID: ${admin._id}`);
    } else {
      console.log(`Using existing ADMIN user: ${admin.email} (ID: ${admin._id})`);
    }

    // Keep track of used slugs to prevent duplicate keys
    const usedSlugs = new Set();
    let questionsIngested = 0;
    let answersIngested = 0;

    for (const faq of faqs) {
      // Create slug
      let baseSlug = slugify(faq.question);
      if (!baseSlug) {
        baseSlug = `faq-${faq.id || Math.floor(Math.random() * 10000)}`;
      }
      let slug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(slug) || (await QuestionModel.findOne({ slug }))) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(slug);

      // Create Question document representing the FAQ
      const questionData = {
        kind: 'faq',
        title: faq.question,
        slug,
        body: faq.question,
        bodyPlain: faq.question,
        category: faq.category || 'General',
        tags: [faq.category ? faq.category.toUpperCase() : 'GENERAL'],
        authorId: admin._id,
        status: 'published',
        visibility: 'public',
        isPinned: false,
        stats: {
          viewCount: 0,
          answerCount: 1,
          replyCount: 0,
          upvoteCount: 0,
          downvoteCount: 0,
          flagCount: 0,
          followerCount: 0
        }
      };

      // Check if this FAQ question already exists in DB
      let questionDoc = await QuestionModel.findOne({ title: faq.question, kind: 'faq' });
      if (!questionDoc) {
        questionDoc = await QuestionModel.create(questionData);
        questionsIngested++;
      } else {
        console.log(`Question already exists: "${faq.question}". Linking to existing document.`);
      }

      // Create Answer document representing the curated answer for this FAQ
      const answerData = {
        questionId: questionDoc._id,
        questionKind: 'faq',
        authorId: admin._id,
        authorRole: 'ADMIN',
        body: faq.answer,
        bodyPlain: stripHtml(faq.answer),
        isAccepted: true,
        isOfficial: true,
        visibility: 'public',
        stats: {
          upvoteCount: 0,
          downvoteCount: 0,
          score: 0,
          replyCount: 0,
          flagCount: 0
        }
      };

      // Check if an official answer already exists for this question
      let answerDoc = await AnswerModel.findOne({ questionId: questionDoc._id, isOfficial: true });
      if (!answerDoc) {
        answerDoc = await AnswerModel.create(answerData);
        answersIngested++;

        // Update Question's acceptedAnswerId
        questionDoc.acceptedAnswerId = answerDoc._id;
        await questionDoc.save();
      }
    }

    console.log(`Ingestion completed successfully!`);
    console.log(`- Questions Ingested: ${questionsIngested}`);
    console.log(`- Answers Ingested: ${answersIngested}`);
  } catch (error) {
    console.error('Ingestion failed with error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
