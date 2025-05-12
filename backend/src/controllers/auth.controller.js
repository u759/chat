import User from "../models/user.model.js"

export const signup = async (req,res) => {
    const{fullName, email, password} = req.body;
    try {
        //hash pw
        if (password.length < 8){
            return res.status(400).json({message: "Password must be at least 8 characters"});
        }

        const user = await User.findOne({email});

        if(user) return res.status(400).json({message: "Email already exists"});
    } catch (error){

    }
}

export const login = (req,res) => {
    res.send("login route");
}

export const logout = (req,res) => {
    res.send("logout route");
}