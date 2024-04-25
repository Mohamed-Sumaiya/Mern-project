const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

// In here we will write all the logic to validate an incoming request for a token that is valid.
const checkAuth = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next(); // Allow the options request to continue. // This ensures that our options request is not blocked.
    }
 try{
    const token = req.headers.authorization.split(' ')[1];// Automatically provided by express.js and is a javaScript object where we get key value pairs, where the keys are headers and their data is the values. // Extract the token from the incoming request. // You may find the token in the request body but for routes that don't have a request body (e.g. delete, get) you wont be able to use the req.body as they don't have a req.body so we can rather use query params or headers. 
    // If the autorization header is not set then it will crash and generate an error instead of just returning undefined.   
    
    if(!token) { // This error will run if the is no valid token.
      throw new Error('Authorization failed, could not find a valid token!')
    }

    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY ); // This will return a string or boject, not a boolean.
    
    // At this point we know the checkAuth didnt fail and the user is authenticated.
    // Add data to the request.
    req.userData = { userId : decodedToken.userId } // Add a userData  to the request object. // This can't be faked by the user because it's part of the token and if the user changes the token then the token is invalid because they don't know the private key. // This is 100% unfaked data.
    
    // Allow the request to continue to the route it's meant for.
    next(); 
} catch (err) { // This error will run if the slpit fails.
    const error = new HttpError('Authorization failed!', 403); // Can use 401 error code for authorization fails.
    return next(error);
 }
};

module.exports = checkAuth;