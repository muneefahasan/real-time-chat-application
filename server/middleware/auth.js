//middleware to protect routes

export const protectRoute = (req,res,next) =>{{
    try{
        const token = req.headers.token;

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.json({success:false,message:"user not found"});

            req.user = user;
            next();
        }

    }catch(error){
        console.log(error.message);
        res.json({success:false,message:"Unauthorized access" })
    }
}
}
//controllers to check if the user is authenticated
export const checkAuth = async(req,res) =>{
    res.json({success:true,user:req.user});
}