import cloudinary from "../lib/cloudinary.js";
import { getUsersSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


const getUsersForSideBar = async (req, res) => {
    try {
        // get the user who has done this request.
        // get his id.
        const ourUser = req.user._id;

        // get all the users who's _id does not match ourUser.
        // $ne here means not equal to.
        // select("-password") tells mongoDB to not include password in its response.
        const filteredUserList = await User.find({ _id: { $ne: ourUser } }).select("-password");

        //we found necessary users now we send it.

        res.status(200).json(filteredUserList)
    } catch (error) {
        console.log("Error in getUserForSideBar controller : " + error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const getMessages = async (req, res) => {
    try {
        // getting the user id of the other user through params
        const { id: otherUsersId } = req.params;
        // getting the user id of our user through req.user
        const userId = req.user._id;

        // finding the messages where either userId has sent to otherUsersId
        // or otherUsersId has sent to userId
        const messages = await Message.find({
            $or: [
                { senderID: userId, recieverID: otherUsersId },
                { senderID: otherUsersId, recieverID: userId }
            ]
        })

        // we found our messages so we send it.
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller : " + error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recieverID } = req.params;
        const senderID = req.user._id;

        let imageUrl;
        if (image) {
            // upload to cloudinary bucket
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderID,
            recieverID,
            text,
            image: imageUrl // this will be either a real url or undefined
        })
        await newMessage.save();

        //get the receiver's socketId
        const recieverSocketId = getUsersSocketId(recieverID);
        // if the user is online (i.e. if the socketId exists)
        // emit an event to that user privately using io.to(socketId).emit("event", data);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller : ", + error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};
export { getUsersForSideBar, getMessages, sendMessage };