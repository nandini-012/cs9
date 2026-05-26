import Answer from '../models/answer.model.js'
import Notification from '../models/notification.model.js'
import Question from '../models/question.model.js'
import { awardSpark } from '../services/spark.service.js'
import { createHttpError } from '../utils/http.js'

function isAdmin(req) {
  return req.user.roles.includes('ADMIN')
}

function canManage(req, answer) {
  return isAdmin(req) || answer.author_id === req.user.userId
}

export async function createAnswer(req, res, next) {
  try {
    const question = await Question.findOne({ question_id: req.params.questionId })

    if (!question) {
      throw createHttpError(404, 'Question not found')
    }
    if (['closed', 'removed'].includes(question.status)) {
      throw createHttpError(409, 'Question closed')
    }

    const answer = await Answer.create({
      question_id: question.question_id,
      author_id: req.user.userId,
      body: req.body.body,
      references: req.body.references,
      attachments: req.body.attachments,
      is_expert: req.user.roles.includes('RESOLVER') || isAdmin(req),
    })

    await Question.updateOne(
      { question_id: question.question_id },
      {
        $inc: { answer_count: 1 },
        $set: {
          status: 'answered',
          ...(answer.is_expert && { has_expert_answer: true }),
        },
      },
    )

    await awardSpark({
      userId: req.user.userId,
      action: 'SUBMIT_ANSWER',
      referenceId: answer.answer_id,
      referenceType: 'answer',
    })

    if (Array.isArray(answer.references) && answer.references.length) {
      await awardSpark({
        userId: req.user.userId,
        action: 'ADD_REFERENCE',
        referenceId: answer.answer_id,
        referenceType: 'answer',
      })
    }

    if (question.author_id !== req.user.userId) {
      await Notification.create({
        recipient_id: question.author_id,
        actor_id: req.user.userId,
        type: 'answer',
        title: 'New answer',
        body: 'Your question received a new answer.',
        reference_id: question.question_id,
        reference_type: 'question',
      })
    }

    res.status(201).json({
      success: true,
      answerId: answer.answer_id,
      message: 'Answer created',
    })
  } catch (error) {
    next(error)
  }
}

export async function updateAnswer(req, res, next) {
  try {
    const answer = await Answer.findOne({ answer_id: req.params.answerId })

    if (!answer) {
      throw createHttpError(404, 'Answer not found')
    }
    if (!canManage(req, answer)) {
      throw createHttpError(403, 'Forbidden')
    }
    if (answer.is_accepted && !isAdmin(req)) {
      throw createHttpError(409, 'Answer locked')
    }
    if (typeof req.body.body !== 'string') {
      throw createHttpError(400, 'Answer body is required')
    }

    answer.body = req.body.body
    await answer.save()

    res.json({ success: true, answer })
  } catch (error) {
    next(error)
  }
}

export async function deleteAnswer(req, res, next) {
  try {
    const answer = await Answer.findOne({ answer_id: req.params.answerId })

    if (!answer) {
      throw createHttpError(404, 'Answer not found')
    }
    if (!canManage(req, answer)) {
      throw createHttpError(403, 'Forbidden')
    }
    if (answer.is_accepted && !isAdmin(req)) {
      throw createHttpError(409, 'Accepted answer cannot be deleted by user')
    }

    answer.is_deleted = true
    answer.moderation_status = 'rejected'
    answer.removal_reason = req.body.reason || ''
    await answer.save()

    res.json({ success: true, message: 'Answer deleted' })
  } catch (error) {
    next(error)
  }
}

export async function voteAnswer(req, res, next) {
  try {
    if (req.body.vote !== 'up') {
      throw createHttpError(400, 'Vote must be up')
    }

    const answer = await Answer.findOne({ answer_id: req.params.answerId })
    if (!answer || answer.is_deleted === true) {
      throw createHttpError(404, 'Answer not found')
    }
    if (answer.author_id === req.user.userId) {
      throw createHttpError(403, 'Cannot vote own answer')
    }
    if (answer.upvoted_by.includes(req.user.userId)) {
      throw createHttpError(409, 'Duplicate vote')
    }

    answer.upvoted_by.push(req.user.userId)
    answer.upvotes += 1
    await answer.save()

    await awardSpark({
      userId: answer.author_id,
      action: 'ANSWER_UPVOTED',
      referenceId: answer.answer_id,
      referenceType: 'answer',
    })

    res.json({ success: true, score: answer.upvotes })
  } catch (error) {
    next(error)
  }
}
