import { model, Schema } from "mongoose";

const OptSchema = new Schema({
    discordId: {
        type: String,
        required: true,
    },
    createdTimestamp: {
        type: Number,
        required: false,
        default: new Date().getTime(),
    },
    reason: {
        type: String,
        required: false,
        default: null,
    },
});

export default model("opts", OptSchema);
