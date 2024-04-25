const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload'); // Object with a bunch of middlewares.

router.get('/', usersControllers.getUsers);

router.post('/signup',
 fileUpload.single('image'), // multer extracts the image from the incoming request before we continue with the steps below. // Here we call the single middleware.
 check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6}), usersControllers.signUp); // normalizeEmail will convert capital letter to small ones . // Test@test.com  => test@test.com

router.post('/login', check('email').normalizeEmail().isEmail(), usersControllers.logIn) // The reason we don't have validators here is because we already have our own validation in the lognIn function. // I added the validation for the this route on my own.

module.exports = router;