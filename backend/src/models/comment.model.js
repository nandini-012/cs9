import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    comment_id: {
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
    answer_id: {
      type: String,
      required: true,
      index: true,
    },
    parent_id: {
      type: String,
      default: null,
      index: true,
    },
    root_comment_id: {
      type: String,
      default: null,
    },
    depth: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    author_id: {
      type: String,
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    mentions: [String],
    upvotes: {
      type: Number,
      default: 0,
    },
    upvoted_by: [String],
    reply_count: {
      type: Number,
      default: 0,
    },
    is_deleted: {
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
  },
  {
    collection: 'comments',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
)

commentSchema.index({ answer_id: 1, parent_id: 1, created_at: 1 })
commentSchema.index({ root_comment_id: 1, depth: 1, created_at: 1 })

export default mongoose.model('Comment', commentSchema)
