import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
	password: string;
	name: string;
    role: string;
	createdAt: Date;
	updatedAt: Date;
}
const UserSchema: Schema = new Schema({
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    }
}, {timestamps: true});

export default mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema);
