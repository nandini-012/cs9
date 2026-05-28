import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const EditHistorySchema = new Schema(
  {
    editedBy: { type: Types.ObjectId, ref: "User", required: true },
    editedAt: { type: Date, default: Date.now },
    previousTitle: { type: String },
    previousBody: { type: String },
  },
  { _id: false }
);

const SparkBountySchema = new Schema(
  {
    amount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "spark" },
    status: {
      type: String,
      enum: ["none", "reserved", "awarded", "refunded"],
      default: "none",
    },
    awardedAnswerId: { type: Types.ObjectId, ref: "Answer", default: null },
    awardedAt: { type: Date, default: null },
  },
  { _id: false }
);

const QuestionStatsSchema = new Schema(
  {
    viewCount: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    flagCount: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const QuestionModerationSchema = new Schema(
  {
    isFlagged: { type: Boolean, default: false },
    reviewedBy: { type: Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    moderationNote: { type: String, default: "" },
  },
  { _id: false }
);

const QuestionSchema = new Schema(
  {
    kind: {
      type: String,
      enum: ["faq", "community"],
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true, maxlength: 300 },
    slug: { type: String, required: true, unique: true, lowercase: true },

    body: { type: String, required: true },
    // Stripped, search-friendly version of `body`. Populate in a pre-save hook.
    bodyPlain: { type: String, default: "" },

    category: { type: String, default: "", index: true },
    tags: { type: [String], default: [], index: true },

    // For kind=faq this is the admin/resolver publisher.
    // For kind=community this is the asking user.
    authorId: { type: Types.ObjectId, ref: "User", required: true, index: true },

    status: {
      type: String,
      enum: [
        // community
        "open",
        "answered",
        "closed",
        "resolved",
        "duplicate",
        // faq
        "draft",
        "published",
        "archived",
      ],
      default: "open",
    },

    visibility: {
      type: String,
      enum: ["public", "hidden", "deleted"],
      default: "public",
    },

    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },

    acceptedAnswerId: { type: Types.ObjectId, ref: "Answer", default: null },

    // Only meaningful for kind=community. FAQs have no bounty.
    sparkBounty: { type: SparkBountySchema, default: () => ({}) },

    stats: { type: QuestionStatsSchema, default: () => ({}) },

    // Updated on any new answer/reply. Drives the "active" sort.
    lastActivityAt: { type: Date, default: Date.now, index: true },

    // If a community question was promoted to FAQ (or duplicates one),
    // point at the FAQ doc here.
    linkedFaqId: { type: Types.ObjectId, ref: "Question", default: null },

    editedAt: { type: Date, default: null },
    editedBy: { type: Types.ObjectId, ref: "User", default: null },
    editHistory: { type: [EditHistorySchema], default: [] },

    moderation: { type: QuestionModerationSchema, default: () => ({}) },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

// Compound indexes for the main read paths.
QuestionSchema.index({ kind: 1, status: 1, lastActivityAt: -1 });
QuestionSchema.index({ kind: 1, category: 1, isPinned: -1, createdAt: -1 });
QuestionSchema.index({ "sparkBounty.status": 1, "sparkBounty.amount": -1 });

// Text index for search. Tune weights to taste.
QuestionSchema.index(
  { title: "text", bodyPlain: "text", tags: "text" },
  { weights: { title: 10, tags: 5, bodyPlain: 1 }, name: "question_text_idx" }
);

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
