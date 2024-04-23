const router = require('express').Router();
const { createUser, getSingleUser, login, deleteBook, saveBook } = require('../../controllers/user-controller');
const { authMiddleware } = require('../../utils/auth');

router.route('/me').get(authMiddleware, getSingleUser);
router.route('/login').post(login);
router.route('/books/:bookId').delete(authMiddleware, deleteBook);
router.route('/').post(createUser).put(authMiddleware, saveBook);

module.exports = router;
