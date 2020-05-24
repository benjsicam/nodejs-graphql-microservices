import bcrypt from 'bcryptjs'

const passwordUtils = {
  async verify(password1, password2) {
    return bcrypt.compare(password1, password2)
  },
  async hash(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be 8 characters or longer.')
    }

    return bcrypt.hash(password, 10)
  }
}

export default passwordUtils
