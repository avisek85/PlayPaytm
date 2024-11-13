const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { User, Account } = require('../db');
// const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');
const JWT_SECRET = process.env.JWT_SECRET;


const router = express.Router();
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
})

router.post("/signup", async (req, res) => {

    const data = req.body;
    const { success } = signupBody.safeParse(data);
    if (!success) {
        return res.status(411).json({
            message: " Incorrect Input"
        })
    }

 try {
    const existingUser = await User.findOne({ username: data.username });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create(data);
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    //Create new account
    await Account.create({
        userId,
        balance:1+Math.random()*10000
    })

    res.json({
        message: "User created Successfuly",
        token: token,
        userId
    })
 } catch (error) {
    res.status(500).json({message:"Error ocured in server"});
    console.log("error while signup ",error);
 }

})

const signinBody = zod.object({
    username : zod.string().email(),
    password:  zod.string()
})


router.post("/signin", async (req, res) => {
try {
    
    const data = req.body;
   

    const { success } = signinBody.safeParse(data);
    if (!success) {
        return res.status(411).json({ message: "Please enter username and password" })
    }

    // const user = await User.findOne({ username: data.username });

    const user = await User.findOne({$and:[{username:data.username},{password:data.password}]})

    if (!user) {
        return res.status(411).json({ message: "User not exist" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(200).json({ token: token,
    userId:user._id })
} catch (error) {
    res.status(500).json({message:"Server Error"});
    console.log(error);
}

})

const updateBody = zod.object({
    password: zod.string().optional,
    firstName: zod.string().optional,
    lastName: zod.string().optional(),
})


router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Update information required"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);
    res.json({ message: "updated successfully" })

})

router.get("/bulk", async (req, res) => {
   try {
    if(!req.query.filter){
        return res.status(400).json({
            message:"PLease pass a filter to search User"
        })
    }
    const filter = req.query.filter;
  
    const users = await User.find({
        $or: [
            {
            firstName: {
                "$regex": filter
            }
        },
        {
            lastName: {
                "$regex": filter
            }
        }
        ]
    })

    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
   } catch (error) {
    res.status(500).json({message:"Server Error"});
    console.log(error);
   }
})

router.post("/me",async (req,res)=>{
try {
    const userId = req.body.userId;
if(!userId){
    return res.status(400).json({
        message:"please send userId"
    })
}
const user = await User.findById(userId);

if(!user){
    return res.status(400).json({message:"user not found"});
};
res.status(200).json({
    message:"user found",
    me:user
})
} catch (error) {
    res.status(500).json({message:"Server Error"});
    console.log(error);
}
})

router.post("/balance",async (req,res)=>{
    try {
        const id = req.body;
    
    const data = await Account.findOne({userId:id.userId});
    
    if(!data){
        return res.status(400).json({
            message:"user not found"
        })
    }
    res.status(200).json({
        message:"Success",
        balance:data.balance
    })
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    console.log(error);
    }
})

router.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

module.exports = router;