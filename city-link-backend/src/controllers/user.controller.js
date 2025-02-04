import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";

const cookieOptions = {
    maxAge: 7*24*60*60*1000 , // 7days
    httpOnly: true,
    sameSite: "lax",
    secure: false,
}

const register = async (req,res,next) => {
    try{
    const { fullName , email , password, mobileNumber} = req.body;

    if (!fullName || !email || !password || !mobileNumber) {
      return next(new AppError("All field are required"));
    }

    const userExists = await User.findOne({ mobileNumber });

    if (userExists) {
      return next(new AppError("Email already exists", 400));
    }

    const user = await User.create({
      fullName,
      email,
      password,
      mobileNumber,
    });

    if (!user) {
      return next(new AppError("User registration failed , please try again"));
    }

    await user?.save();

    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Email or password does not match", 400));
    }

    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged-in successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export { register, login };
