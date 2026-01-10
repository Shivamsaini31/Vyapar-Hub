import mongoose from "mongoose";

interface IUser{
    _id: mongoose.Types.ObjectId;

    name:string;
    email:string;
    password?:string;
    image?:string;
    phone?:number;
    role: "user" | "vendor" | "admin";

    //for vendor
    shopName?:string;
    shopAddress?:string;
    gstNumber?:string;
    isApproved?: boolean;
    verificationStatus?: "pending" | "approved" | "rejected";
    requestedAt?: Date;
    approvedAt?: Date;
    rejectedReason?: string;

    vendorProducts?:mongoose.Types.ObjectId[];
    orders?: mongoose.Types.ObjectId[];

    cart?:{
        product:mongoose.Types.ObjectId;
        quantity:number;
    }[];

    createdAt?:Date;
    updatedAt?:Date;
};


const userSchema= new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    image:{
        type: String
    },
    phone:{
        type:Number
    },
    role:{
        type: String,
        enum:["user","vendor","admin"],
        default:"user",
        required:true,
    },
    shopName:{
        type:String,
    },
    shopAddress:{
        type:String,
    },          
    gstNumber:{
        type:String,
    },  
    isApproved:{                
        type:Boolean,
        default:false
    },
    verificationStatus:{
        type:String,
        enum:["pending","approved","rejected"],
        default: "pending"
    },
    approvedAt:{
        type:Date,
    },   
    rejectedReason:{
        type:String,
    },
    
    requestedAt:{
        type:Date,
    },

    vendorProducts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }],

    cart:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        quantity:{
            type:Number,
            default:1
        }
    }],


},{
    timestamps:true
});

// if User model already exists, use it. Otherwise, create a new model.
const User= mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;