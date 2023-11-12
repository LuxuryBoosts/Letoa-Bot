import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    discordTag: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
        default: null,
    },
    guilds: {
        type: Array,
        required: true,
    },
    email: {
        type: String,
        required: false,
        default: null,
    },
    banned: {
        type: Boolean,
        required: false,
        default: false,
    },
    /**
     * Starting to add premium towards user accounts with linking up with patreon and then selecting a guild to activate premium
     * 0 - null
     * 1 - Gold Tier Of Premium
     * 2 - Diamond Tier Of Premium
     * 3 - Platinum  Tier Of Premium
     */
    premium: {
        type: Number,
        required: false,
        default: 0,
    },
    availablePremiumServers: {
        type: Number,
        required: false,
        default: 0,
    },
    activatedPremiumServers: {
        type: Array,
        required: false,
        default: [],
    },
    linkedPatreonAccount: {
        type: String,
        required: false,
        default: null,
    },
});

export default mongoose.model("users", UserModel);
