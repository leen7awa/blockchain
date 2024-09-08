const express = require("express");
const router = express.Router();

const { login, register, getAllUsers, createAccount, loadAccounts, sendTransaction, checkBalance, restoreWallet, loadSeedPhrase, fetchSeedPhrase } = require("../controllers/main");
const authMiddleware = require('../middleware/auth');

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/users").get(getAllUsers);
router.route("/account").post(authMiddleware, createAccount);
router.route("/accounts").get(authMiddleware, loadAccounts);
router.route("/send-transaction").post(authMiddleware, sendTransaction);
router.route("/balance").post(authMiddleware, checkBalance);
router.route("/restore").post(authMiddleware, restoreWallet);
router.route("/seed-phrase").get(authMiddleware, loadSeedPhrase);
// router.route("/seed-phrase/:username").get(loadSeedPhrase);
// router.route("/change-password").post(authMiddleware, changePassword);

// New route to fetch seed phrase by username
// router.route("/fetch-seedphrase").post(fetchSeedPhrase);

module.exports = router;
