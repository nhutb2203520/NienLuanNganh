const express = require("express");
const router = express.Router();
const nhanVienController = require("../controllers/nhanvien.controller");
const { verifyTokenStaff } = require("../middlewares/verifyToken");
router
  .post("/register", nhanVienController.StaffRegister)
  .post("/login", nhanVienController.login)
  .patch(
    "/change-password",
    verifyTokenStaff,
    nhanVienController.changePassword
  )
  .patch("/me", verifyTokenStaff, nhanVienController.updateAccountStaff)
  .delete("/me", verifyTokenStaff, nhanVienController.delete);
module.exports = router;
