const router = require('express').Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  patchInfoUser,
  patchAvatarUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUser);

router.patch('/me', patchInfoUser);

router.patch('/me/avatar', patchAvatarUser);

module.exports = router;
