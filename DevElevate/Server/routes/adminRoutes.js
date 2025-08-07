import express from "express";
import { 
  addUser,
  createAdminLog, 
  getAdminLogs,getAllUserRegister
} from "../controller/adminController.js";
import { 
  sendNewsletter, 
  getEmailLogs 
} from "../controller/emailController.js"; 
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/system-log",authenticateToken,requireAdmin, createAdminLog);

router.get("/system-logs", getAdminLogs);

router.get("/all-users",authenticateToken,requireAdmin,getAllUserRegister)
router.post("/email/send", sendNewsletter); 
router.get("/email/logs", getEmailLogs); 

router.post("/add-user",authenticateToken,requireAdmin,addUser)


export default router;