const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.sevice")
const tokenBlackListModel = require("../models/blackList.model")

// user register controller
// POST /api/auth/register

async function userRegisterController(req,res){

    const {email,password,name} = req.body;
    const isExists = await userModel.findOne({
        email : email

    }) 
    if(isExists){
        return res.status(422).json({
            message : "User already exists with email.",
            status : "failed"
        })
    }
    const user = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET,{expiresIn : "3d"})

    res.cookie("token",token)
    res.status(201).json({
        user: {
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })
    await emailService.sendRegistrationEmail(user.email, user.name)
}




// User Login controller
// POST /api/auth/login

async function userLoginController(req,res){
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({
            message : "Email or password is invalid"
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message : "Email or password is invalid"
        })
    }

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET,{expiresIn : "3d"})

    res.cookie("token",token)
    res.status(200).json({
        user: {
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })
 
}


//User Logout Controller
// POST /api/auth/logout

async function userLogoutController(req,res){
    const token  = req.cookies.token || req.header.authorization?.split(" ")[1]

    if(!token){
        return res.status(200).json({
            message : "User Logged Out Successfully"
        })
    }

    

    await tokenBlackListModel.create({
        token : token
    })
    
    res.clearCookie("token");

    return res.status(200).json({
        message:"User logged Out Successfully"
    })
}



module.exports={    
    userRegisterController,
    userLoginController,
    userLogoutController
}