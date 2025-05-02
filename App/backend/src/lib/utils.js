import jwt from "jsonwebtoken";


// generate and return  the token
export const generateToken = (userId, res) => {
     // generating a token with jwt.
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
   
    // setting it into response cookies
    res.cookie("authToken", token, {
        maxAge: 7*24*60*60*1000, // 7 days
        httpOnly: true,
      sameSite: "strict",
      secure : process.env.NODE_ENV !== "development"
    })

    // returning token
    return token;
 };