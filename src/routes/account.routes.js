const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const accountController = require('../controller/account.controller');

const router = express.Router();

// POST-/api/account
// Create a new account
// Protected route

router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);


// GET /api/accounts/
// get all accounts of the logged in user acount
// protectec route

router.get("/" , authMiddleware.authMiddleware, accountController.getUserAccountsController)


// // GET-/api/account/balance/:accountId
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)


module.exports = router;