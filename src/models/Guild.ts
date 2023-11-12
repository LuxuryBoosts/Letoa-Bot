import { model, Schema } from "mongoose";

const GuildModel = new Schema({
    id: {
        type: String,
    },
    premium: {
        type: Boolean,
        default: false,
    },
    /**
     * 0 - null
     * 1 - Gold Tier Of Premium
     * 2 - Diamond Tier Of Premium
     * 3 - Platinum  Tier Of Premium
     */
    premiumLevel: {
        type: Number,
        required: false,
        default: 0,
    },
    premiumGiver: {
        type: String,
        required: false,
        default: null,
    },
    onCooldown: {
        type: Boolean,
        default: false,
        required: false,
    },
    lastBackup: {
        type: Number,
        default: null,
    },
    restoreKey: {
        type: String,
        default: null,
        required: false,
    },
    premiumExpires: {
        type: Number,
        default: null,
        required: false,
    },
    /**
     * we are going to have a system where u can link your letoa
     * account and the members will be linked to the account so
     * you can easily manage them + restore them
     * @example
     * User goes to the server where they want to restore, they have the option to restore members or server.
     * ```diff
     * Server:
     * - They have options to choose from their saved backups.
     * - They click on the backup they want to view and it'll have a little preview showing what it contains.
     * - Then they is 2 buttons, "Confirm" and "Cancel".
     * - Confirm will then send a request to the api with a heavy ratelimit and will start the restore.
     * ```
     */
    accountID: {
        type: String,
        required: false,
        default: null,
    },
    name: {
        type: String,
        required: false,
        default: null,
    },
    iconURL: {
        type: String,
        required: false,
        default: "https://cdn.desipher.io/default.png",
    },
    /**
     * To see if the server has been activated with premium.
     */
    activated: {
        type: Boolean,
        required: false,
        default: false,
    },
    /**
     * The `accountID` of the user that activated premium.
     */
    activatedBy: {
        type: String,
        required: false,
        default: null,
    },
});

export default model("guilds", GuildModel);
