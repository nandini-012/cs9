import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const AnswerEditHistorySchema = new Schema(
  {
    editedBy: { type: Types.ObjectId, ref: "User", required: true },
    editedAt: { type: Date, default: Date.now },
    previousBody: { type: String },
  },
  { _id: false }
);

const AnswerStatsSchema = new Schema(
  {
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    // score = upvoteCount - downvoteCount, denormalized for cheap sorting.
    score: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    flagCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const SparkAwardSchema = new Schema(
  {
    amount: { type: Number, default: 0 },
    awardedAt: { type: Date, default: null },
    transactionId: {
      type: Types.ObjectId,
      ref: "SparkTransaction",
      default: null,
    },
  },
  { _id: false }
);

const AnswerModerationSchema = new Schema(
  {
    isFlagged: { type: Boolean, default: false },
    reviewedBy: { type: Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { _id: false }
);

const AnswerSchema = new Schema(
  {
    questionId: {
      type: Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    // Denormalized copy of question.kind. Keep in sync on the rare event
    // a question is promoted from community to faq.
    questionKind: {
      type: String,
      enum: ["faq", "community"],
      required: true,
    },

    authorId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Snapshot of author's role at posting time. Useful for badges
    // ("Answered by RESOLVER") without joining role mappers.
    authorRole: {
      type: String,
      enum: ["USER", "RESOLVER", "ADMIN"],
      required: true,
    },

    body: { type: String, required: true },
    bodyPlain: { type: String, default: "" },

    // Mirrors questions.acceptedAnswerId === this._id.
    // Denormalized so you can sort answers accepted-first cheaply.
    isAccepted: { type: Boolean, default: false },

    // FAQ-specific: marks the canonical answer shown by default on an FAQ.
    isOfficial: { type: Boolean, default: false },

    visibility: {
      type: String,
      enum: ["public", "hidden", "deleted"],
      default: "public",
    },

    stats: { type: AnswerStatsSchema, default: () => ({}) },

    // Populated when this answer was accepted and a bounty was paid out.
    sparkAward: { type: SparkAwardSchema, default: () => ({}) },

    editedAt: { type: Date, default: null },
    editedBy: { type: Types.ObjectId, ref: "User", default: null },
    editHistory: { type: [AnswerEditHistorySchema], default: [] },

    moderation: { type: AnswerModerationSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Primary read path: question detail page.
// Sort accepted-first, then by score, then chronologically.
AnswerSchema.index({
  questionId: 1,
  isAccepted: -1,
  "stats.score": -1,
  createdAt: 1,
});

// FAQ canonical answer lookup.
AnswerSchema.index({ questionKind: 1, isOfficial: 1 });

export default mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);
