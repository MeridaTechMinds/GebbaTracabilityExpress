import bcrypt from 'bcrypt'

const saltRound = 10
export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRound)
    return bcrypt.hashSync(password, salt)
}

export const comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword)
}