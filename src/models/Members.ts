import { model, Schema } from "mongoose";

const Members = new Schema({
    discordId: {
        type: String,
        required: true,
    },
    guild: {
        type: String,
        required: true,
    },
    discordTag: {
        type: String,
        required: false,
        default: null,
    },
    avatar: {
        type: String,
        required: false,
        default: null,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    new: {
        type: Boolean,
        required: false,
        default: false,
    },
    expires: {
        type: Number,
        required: false,
        default: null,
    },
    loggedIP: {
        type: String,
        required: false,
        default: null,
    },
});

export default model("members", Members);
