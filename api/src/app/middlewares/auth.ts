import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/apiError";
import { JwtHelper } from "../../helpers/jwtHelper";
import config from "../../config";
import { Secret } from "jsonwebtoken";

export const auth = (...rules: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new ApiError(404, "Token is not Found !!")
        }

        // Extract token from "Bearer <token>" format
        let token: string;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove "Bearer " prefix
        } else {
            token = authHeader; // Fallback for direct token
        }

        if (!token) {
            throw new ApiError(404, "Token is not Found !!")
        }

        let verifiedUser;
        try {
            verifiedUser = await JwtHelper.verifyToken(token, config.jwt.secret as Secret);
            console.log('🔍 JWT Token verified successfully:', { 
                userId: verifiedUser.userId, 
                role: verifiedUser.role 
            });
        } catch (error) {
            console.error('❌ JWT Token verification failed:', error);
            throw new ApiError(403, "User is not Found !!")
        }
        
        req.user = verifiedUser;

        if (rules.length && !rules.includes(verifiedUser.role)) {
            throw new ApiError(403, "You are not Authorised !!")
        }
        next();
    } catch (error) {
        next(error)
    }
}