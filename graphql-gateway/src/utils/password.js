import bcrypt from 'bcryptjs'

const passwordUtils = {
  async hashPassword(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be 8 characters or longer.')
    }

    return bcrypt.hash(password, 10)
  }
}

export default passwordUtils
