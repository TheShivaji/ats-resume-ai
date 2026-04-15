import { Router } from "express";
import { signupController, loginController, logoutController } from "../controllers/auth.controller.js";
const authRouter = Router();


authRouter.post('/signup', signupController);
authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);

export default authRouter;