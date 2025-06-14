import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import ApiFeatures from "../utils/apiFeatures.js";

import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const getUsersForSidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  // Rule: Do not return the currently logged-in user
  const filter = { _id: { $ne: loggedInUserId } };

  const totalUsers = await User.countDocuments(filter);

  const apiFeatures = new ApiFeatures(User.find(filter), req.query)
    .paginate(totalUsers)
    .filter()
    .limitFields()
    .sort()
    .search();

  const { mongooseQuery, paginateResult } = apiFeatures;

  const users = await mongooseQuery;

  res.status(200).json({
    results: users.length,
    paginateResult,
    data: users,
  });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("senderId", "fullName ")
    .populate("receiverId", "fullName ");

  res.status(200).json(messages);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageUrl;

  if (image) {
    // Uploade base64 image on Cloudinary
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
  // todo:real time functionalty for real time messaging => socket.io
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("new message", newMessage);
  }

  res.status(201).json(newMessage);
});
