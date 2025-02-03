import User from "../models/user.model.js";


const register = async (req,res,next) => {
    const { fullName , email , password} = req.body;

    if(!fullName || !email || !password){
        return next(new AppError('All field are required'))
    }

    const userExists = await User.findOne({ email });

    if(userExists){
        return next(new AppError('Email already exists' ,400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
    });

    if(!user){
        return next(new AppError('User registration failed , please try again'))
    }

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookieOptions)
   
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
        
    })
    // console.log("Hello");
};

const login= async (req,res,next) => {
    try{
        const {email , password} = req.body;

    if(!email || !password){
        return next(new AppError('All fields are required' , 400));
    }

    const user = await User.findOne({
        email
    }).select('+password');

    if(!user || !user.comparePassword(password)){
        return next(new AppError('Email or password does not match' , 400))
    }

    const token  = await user.generateJWTToken();
    user.password = undefined;

    res.cookie('token', token , cookieOptions);

    res.status(200).json({
        success: true,
        message: "User loggedin successfully",
        user,
    });
    }catch(e){
        return next(new AppError(e.message , 500))
    }
};

export{
    register,
    login
}