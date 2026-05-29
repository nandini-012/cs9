/**
 * Backfill UserProfile.reputation from existing answer data.
 *
 * reputation = (accepted answers × 15) + (total answer upvotes × 10)
 * — mirrors the going-forward increments in spark.service REPUTATION_POINTS.
 *
 * Run once after deploying the reputation feature:
 *   npm run recompute:reputation
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Answer from '../models/answer.model.js'
import UserProfile from '../models/user-profile.model.js'

const ACCEPTED_WEIGHT = 15
const UPVOTE_WEIGHT = 10

try {
  await connectDB()

  // Sum reputation contributions per author from non-deleted answers
  const rows = await Answer.aggregate([
    { $match: { is_deleted: { $ne: true } } },
    {
      $group: {
        _id: '$author_id',
        accepted: { $sum: { $cond: ['$is_accepted', 1, 0] } },
        upvotes: { $sum: { $ifNull: ['$upvotes', 0] } },
      },
    },
  ])

  let updated = 0
  for (const row of rows) {
    const reputation = row.accepted * ACCEPTED_WEIGHT + row.upvotes * UPVOTE_WEIGHT
    await UserProfile.updateOne(
      { user_id: row._id },
      { $set: { reputation }, $setOnInsert: { user_id: row._id } },
      { upsert: true },
    )
    updated += 1
  }

  console.log(`Reputation recomputed for ${updated} user(s).`)
} finally {
  await mongoose.disconnect()
}
