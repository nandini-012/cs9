import mongoose from 'mongoose'
import argon2 from 'argon2'
import 'dotenv/config'
import connectDB from './src/config/db.js'
import User from './src/models/user.model.js'

const importData = async () => {
  try {
    await connectDB()
    await User.deleteMany()

    const passwordHash = await argon2.hash('password123')

    const users = [
      {
        name: 'Admin User',
        email: 'admin@iitr.ac.in',
        passwordHash,
        role: 'ADMIN',
      },
      {
        name: 'Student User',
        email: 'student@iitr.ac.in',
        passwordHash,
        role: 'USER',
      },
      {
        name: 'Resolver User',
        email: 'resolver@iitr.ac.in',
        passwordHash,
        role: 'RESOLVER',
      },
    ]

    await User.insertMany(users)

    console.log(
      'Data Imported: Admin, Student, and Resolver accounts created with argon2-hashed passwords!'
    )
    await mongoose.disconnect()
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

importData()