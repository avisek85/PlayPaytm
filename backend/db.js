const mongoose = require('mongoose');

try {
    (async ()=>{
        
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected")
    })();
 
} catch (error) {
    console.log("error while connecting to db",error);
}

// console.log("db connected");

// const paytm_schema= mongoose.Schema({
//     userName:String,
//     firstName:String,
//     LastName:String,
//     password:String
// });

const paytm_schema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:50
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxlength:50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxlength:50
    }
})

// modules.export = mongoose.model('User',paytm_schema);

const User = mongoose.model('User',paytm_schema);

const account_schema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true,
    }
})

const Account = mongoose.model('Account',account_schema);


module.exports = {
    User,
    Account
};

