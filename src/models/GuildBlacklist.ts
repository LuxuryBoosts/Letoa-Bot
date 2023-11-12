import { model, Schema } from "mongoose";

const GuildBlacklists = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
});

export default model("guild_blacklists", GuildBlacklists);
