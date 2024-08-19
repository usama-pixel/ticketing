import mongoose from "mongoose";
import { Password } from "../services/password";

// interface that describes what it takes to create a user
interface UserAttrs {
    email: string
    password: string
}

// interface that describes what the user model looks like
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

// interface that describes the properties that a User Document
// returns after we query the model
interface UserDoc extends mongoose.Document {
    email: string
    password: string
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id
            delete ret.password;
            delete ret.__v
            delete ret._id
        }
    }
})
userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done();
})
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }