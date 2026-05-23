import mongoose from 'mongoose'
import Role from '../models/role.model.js'
import UserRoleMapper from '../models/user-role-mapper.model.js'
import User from '../models/user.model.js'

const applicationModels = [User, Role, UserRoleMapper]

export async function initializeCollections() {
  await Promise.all(applicationModels.map((model) => model.createCollection()))
  await Promise.all(applicationModels.map((model) => model.createIndexes()))
}

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI
  const databaseName = process.env.MONGODB_DB_NAME

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined')
  }

  const connection = await mongoose.connect(
    mongoUri,
    databaseName ? { dbName: databaseName } : undefined,
  )

  await initializeCollections()

  console.log(
    `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`,
  )
  console.log('MongoDB collections ready: users, roles, user_role_mappers')

  return connection
}
