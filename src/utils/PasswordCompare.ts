import bcrypt from 'bcrypt'

export const passwordCompare = async (password: string, userPassword: string) => {
  const comparePassword = await bcrypt.compare(password, userPassword)

  return comparePassword
}
