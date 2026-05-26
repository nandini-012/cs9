import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema(
  {
    answer_id: {
      type: String,
      default: randomUUID,
      immutable: true,
      unique: true,
      index: true,
    },
    question_id: {
      type: String,
      required: true,
      index: true,
    },
    author_id: {
      type: String,
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
      minlength: 20,
    },
    references: [{ url: String, label: String }],
    attachments: [{ file_url: String, file_name: String, mime_type: String }],
    is_expert: {
      type: Boolean,
      default: false,
    },
    expert_type: String,
    specialty: String,
    is_accepted: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvoted_by: [String],
    comment_count: {
      type: Number,
      default: 0,
    },
    top_level_comment_count: {
      type: Number,
      default: 0,
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
    collection: 'answers',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

answerSchema.index({ question_id: 1, is_accepted: 1 })
answerSchema.index({ question_id: 1, upvotes: -1 })
answerSchema.index({ question_id: 1, created_at: -1 })

export default mongoose.model('Answer', answerSchema)
