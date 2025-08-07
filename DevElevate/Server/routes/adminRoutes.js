import express from "express";
import { 
  createAdminLog, 
  getAdminLogs,getAllUserRegister
} from "../controller/adminLogController.js";
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


export default router;