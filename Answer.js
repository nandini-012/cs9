const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    // The top-level root question of the discussion thread
    rootQuestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true
    },
    // The direct parent this is replying to (can be the root Question or another Answer)
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'parentType',
      default: null,
      index: true
    },
    // Distinguishes if parent is a Question or another Answer
    parentType: {
      type: String,
      enum: ['Question', 'Answer'],
      default: 'Question'
    },
    questionKind: {
      type: String,
      default: 'community'
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    authorRole: {
      type: String,
      enum: ['USER', 'RESOLVER', 'ADMIN'],
      default: 'USER'
    },
    body: {
      type: String,
      required: true
    },
    bodyPlain: {
      type: String,
      required: true
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    isOfficial: {
      type: Boolean,
      default: false
    },
    visibility: {
      type: String,
      enum: ['public', 'hidden', 'deleted'],
      default: 'public',
      index: true
    },
    stats: {
      upvoteCount: {
        type: Number,
        default: 0
      },
      downvoteCount: {
        type: Number,
        default: 0
      },
      score: {
        type: Number,
        default: 0
      },
      replyCount: {
        type: Number,
        default: 0
      },
      flagCount: {
        type: Number,
        default: 0
      }
    },
    sparkAward: {
      amount: {
        type: Number,
        default: 0
      },
      awardedAt: {
        type: Date,
        default: null
      },
      transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    },
    // Single-edit tracking fields (prevents needing edit history arrays or tables)
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: {
      type: Date,
      default: null
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    moderation: {
      isFlagged: {
        type: Boolean,
        default: false
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      reviewedAt: {
        type: Date,
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Answer', answerSchema);
