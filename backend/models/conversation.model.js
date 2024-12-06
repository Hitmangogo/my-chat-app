import mongoose, { mongo } from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
    },
    { timestamps: true}
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;