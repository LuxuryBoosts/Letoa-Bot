import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: false,
        default: null,
    },
    accountID: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    banned: {
        type: Boolean,
        required: false,
        default: false,
    },
    premiumLevel: {
        type: Number,
        required: false,
        default: 0,
    },
    premiumExpire: {
        type: Number,
        required: false,
        default: null,
    },
    token: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    previousLinkedAccounts: {
        type: Array,
        required: false,
        default: [],
    },
    suspensionExpires: {
        type: Number,
        required: false,
        default: null,
    },
    admin: {
        type: Boolean,
        required: false,
        default: false,
    },
    lastLoginIP: {
        type: String,
        required: false,
        default: null,
    },
    allowedCustomBots: {
        type: Boolean,
        required: false,
        default: false,
    },
});

export default mongoose.model("logins", LoginSchema);
