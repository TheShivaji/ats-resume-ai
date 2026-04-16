import { Router } from "express";
import { signupController, loginController, logoutController, refreshController } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { loginValidator, registerValidator } from "../validators/auth.validators.js";
const authRouter = Router();


authRouter.post('/signup', registerValidator, signupController);
authRouter.post('/login', loginValidator ,loginController);
authRouter.post('/logout', logoutController);
authRouter.get('/get-me' , authUser , getMeControllers)
authRouter.post('refresh-token' , authUser , refreshController)

export default authRouter;