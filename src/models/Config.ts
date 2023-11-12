import { model, Schema } from "mongoose";

const ConfigModel = new Schema({
    id: {
        type: String,
        required: true,
    },
    verificationRole: {
        type: String,
        required: false,
        default: null,
    },
    verificationEnabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    loggingChannel: {
        type: String,
        required: false,
        default: null,
    },
    customDomain: {
        type: String,
        required: false,
        default: null,
    },
    backupInterval: {
        type: Number,
        required: false,
        default: null,
    },
    backupAutomatically: {
        type: Boolean,
        default: false,
        required: false,
    },
    customColour: {
        type: String,
        required: false,
        default: null,
    },
    redirectLink: {
        type: String,
        required: false,
        default: null,
    },
    logIp: {
        type: Boolean,
        required: false,
        default: false,
    },
    vpnCheck: {
        type: Boolean,
        required: false,
        default: false,
    },
    customMessage: {
        type: String,
        required: false,
        default: null,
    },
    customLink: {
        type: String,
        required: false,
        default: null,
    },
    /**
     * Only available to premium duh
     */
    inAppCustomMessage: {
        type: String,
        required: false,
        default: null,
    },
    /**
     * null - Verify
     * Max length of 80 characters
     */
    inAppButtonText: {
        type: String,
        required: false,
        default: null,
    },
    inAppEmbedColor: {
        type: Number,
        required: false,
        default: null,
    },
    inAppCustomImage: {
        type: String,
        required: false,
        default: null,
    },
});

export default model("config", ConfigModel);
