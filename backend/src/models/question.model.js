import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
  {
    question_id: {
      type: String,
      default: randomUUID,
      immutable: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    body: {
      type: String,
      required: true,
    },
    category: String,
    tags: [String],
    spark_bounty: {
      type: Number,
      default: 0,
      min: 0,
    },
    author_id: {
      type: String,
      required: true,
      index: true,
    },
    /* Added to track if the question was raised anonymously */
    is_anonymous: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['unanswered', 'answered', 'closed', 'removed'],
      default: 'unanswered',
      index: true,
    },
    is_pinned: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvoted_by: [String],
    view_count: {
      type: Number,
      default: 0,
    },
    answer_count: {
      type: Number,
      default: 0,
    },
    has_expert_answer: {
      type: Boolean,
      default: false,
    },
    moderation_status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
      index: true,
    },
    moderated_by: String,
    moderated_at: Date,
    moderation_reason: String,
    removal_reason: String,
  },
  {
    collection: 'questions',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

questionSchema.index({ category: 1, status: 1 })
questionSchema.index({ tags: 1 })
questionSchema.index({ created_at: -1 })
questionSchema.index({ upvotes: -1 })
questionSchema.index({ title: 'text', body: 'text', tags: 'text' })

export default mongoose.model('Question', questionSchema)
