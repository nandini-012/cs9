import mongoose from 'mongoose'
import User from '../models/user.model.js'

function createHttpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function validateUserId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError(400, 'Invalid user id')
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
    })

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export async function getUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    next(error)
  }
}

export async function getUser(req, res, next) {
  try {
    validateUserId(req.params.id)

    const user = await User.findById(req.params.id)

    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}

export async function updateUser(req, res, next) {
  try {
    validateUserId(req.params.id)

    const updates = {}

    if (req.body.name !== undefined) {
      updates.name = req.body.name
    }

    if (req.body.email !== undefined) {
      updates.email = req.body.email
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    )

    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}

export async function deleteUser(req, res, next) {
  try {
    validateUserId(req.params.id)

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
