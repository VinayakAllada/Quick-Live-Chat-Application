import jwt from 'jsonwebtoken'

//FUnction to generate token for a user
export const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET)
    return token;
}