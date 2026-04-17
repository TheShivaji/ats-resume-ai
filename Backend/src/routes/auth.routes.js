import { Router } from "express";
import { signupController, loginController, logoutController, refreshController , getMeController} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { loginValidator, registerValidator } from "../validators/auth.validators.js";
const authRouter = Router();


authRouter.post('/signup', registerValidator, signupController);
authRouter.post('/login', loginValidator ,loginController);
authRouter.post('/logout', logoutController);
authRouter.get('/get-me' , authUser , getMeController)
authRouter.post('/refresh-token' , refreshController)

export default authRouter;