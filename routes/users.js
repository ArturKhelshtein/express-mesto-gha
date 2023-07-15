const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  patchInfoUser,
  patchAvatarUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', createUser);

router.patch('/me', patchInfoUser);

router.patch('/me/avatar', patchAvatarUser);

module.exports = router;
