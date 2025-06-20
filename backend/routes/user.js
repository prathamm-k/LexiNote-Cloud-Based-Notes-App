const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  uploadAvatar,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + '-' + Date.now() + ext);
  },
});
const upload = multer({ storage });

router.route('/profile').get(auth, getUserProfile).put(auth, updateUserProfile);
router.route('/password').put(auth, updateUserPassword);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router; 