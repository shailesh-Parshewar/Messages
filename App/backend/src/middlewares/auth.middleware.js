import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const protectRoute = async (req, res, next) => {
    try {
        // check if there is token in cookies
        // this will return undefined if there is no token which means that user is unauthorized
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(400).json({ message: "Unauthorized - No Token Provided" })
        }
        // this function allows us to decode the value we used while creating the token 
        // which in this case is userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            //decoded is a falsy value which means the token is invalid.
            return res.status(400).json({ message: "Unauthorized - Invalid Token" })
        }
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            //token was valid but we couldn't find user in our database 
            // this will rarely happen
            return res.status(404).json({ message: "No User Found" })
        }
        // user is valid and the token is also valid
        req.user = user;

        next()

    } catch (error) {
  console.log("Error in ProtectRoute middleware : " + error)
  res.status(500).json({message: "Internal Server Error"})
    }
}
export { protectRoute };