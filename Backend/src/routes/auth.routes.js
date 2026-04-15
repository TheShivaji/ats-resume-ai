import { Router } from "express";
import { signupController, loginController, logoutController } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const authRouter = Router();


authRouter.post('/signup', signupController);
authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);
authRouter.get('/get-me' , authUser , getMeControllers)

export default authRouter;