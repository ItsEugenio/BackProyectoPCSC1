import {Schema,model} from "mongoose";

const userSchema = new Schema({
    user: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    }
}, {
    versionKey: false,
    timestamps: true //agrega el createAtt y updateAtt
});

export default model('User',userSchema)