import jwt from 'jsonwebtoken';


export const checkAuth = async(req, res, next) => {

    try {
        const token =req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
               error: "Unauthorized user"
            })
        }

        const decodedUser = jwt.verify(token , process.env.JWT_TOKEN);

        req.user = decodedUser;
        next();

    } catch (error) {
        console.log("Error in auth middleware", error)
        res.status(500).json({
            message: "Somthing went wrong in auth",
            error: error.message
        })
    }
}