import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

const passwordHashRounds = 12
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function createHttpError(statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function validateUserId(id) {
  if (!uuidPattern.test(id)) {
    throw createHttpError(400, 'Invalid user id')
  }
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw createHttpError(400, 'Password must be at least 8 characters')
  }
}

export async function createUser(req, res, next) {
  try {
    validatePassword(req.body.password)

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: await bcrypt.hash(req.body.password, passwordHashRounds),
    })

    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

export async function loginUser(req, res, next) {
  try {
    const email =
      typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : ''

    const password =
      typeof req.body.password === 'string'
        ? req.body.password
        : ''

    const user = await User.findOne({
      email,
    }).select('+passwordHash')

    if (!user || !password) {
      throw createHttpError(
        401,
        'Invalid email or password',
      )
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.passwordHash,
    )

    if (!isPasswordMatch) {
      throw createHttpError(
        401,
        'Invalid email or password',
      )
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}


export async function getUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ created_at: -1 })

    res.json(users)
  } catch (error) {
    next(error)
  }
}

export async function getUser(req, res, next) {
  try {
    validateUserId(req.params.id)

    const user = await User.findOne({ user_id: req.params.id })

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

    if (req.body.password !== undefined) {
      validatePassword(req.body.password)
      updates.passwordHash = await bcrypt.hash(req.body.password, passwordHashRounds)
    }

    const user = await User.findOneAndUpdate(
      { user_id: req.params.id },
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

    const user = await User.findOneAndDelete({ user_id: req.params.id })

    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    res.status(204).send()
  } catch (error) {
    next(error)
  }
}
