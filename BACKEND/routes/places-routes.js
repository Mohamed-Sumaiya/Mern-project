const express = require('express');
const router = express.Router(); // This gives us a special object where we can register middleware as well.
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.get('/:pid', placesControllers.getPlaceById); // Execute pointer.

router.get('/user/:uid', placesControllers.getPlacesByUserId) // Execute pointer. // Won't clash with the first get route as the routes arent the same.

// A user will only be able to access the routes below if they are authenticated because of this authentication middleware function.
router.use(checkAuth); // Don't execute it just pass a pointer to it so that this function gets registered by express as a middleware function.

// Any route after the above check(middleware) is protected and can only be reached with a valid token. 

// You can execute more than one middleware on a http method path combination.
// They will be executed from left to right.
router.post('/', 
 fileUpload.single('image'),
 check('title').not().isEmpty(), check('description').isLength({min: 5}), check('address').not().isEmpty(),placesControllers.createPLace); // Execute pointer.

router.patch('/:pid', check('title').not().isEmpty(), check('description').isLength({min: 5}), placesControllers.updatePlace ) 

router.delete('/:pid', placesControllers.deletePlace )

module.exports = router; // Export individual route.