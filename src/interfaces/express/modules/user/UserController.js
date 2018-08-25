const { Router } = require('express');

const {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  getMe,
  updateMe,
} = require('./endpoints');


const UserController = {
  get router() {
    const router = Router();

    router.get('/me/', getMe); // Authenticated
    router.put('/me/', updateMe); // Authenticated

    router.get('/', getAllUsers); // Admin
    router.post('/', createUser); // Admin
    router.get('/:id/', getUser); // Admin
    router.delete('/:id/', deleteUser); // Admin
    router.put('/:id/', updateUser); // Admin

    return router;
  },
};

module.exports = UserController;
