import { model, Schema } from "mongoose";

const ErrorSchema = new Schema({
    errorCode: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: false,
        default: {},
    },
});

export default model("errors", ErrorSchema);
