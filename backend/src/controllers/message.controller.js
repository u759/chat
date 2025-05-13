import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");    //all users not equal to self
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getMessages = async (req,res) => {
    try {
        const {id: userToChatId} = req.params;  //copy id value to userToChatId
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[   //find all messages in db that is a conversation between two people (either I send or they send)
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const sendMessage = async (req,res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;    //copy id to receiverId
        const senderId = req.user._id;

        let imageUrl;

        if(image){  //upload pic to cloudinary if exists
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //todo: realtime functionality with socket.io here

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};