const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const HttpError = require('../models/http-error');
const User = require('../models/users-schema');
const jwtoken = require('jsonwebtoken');


const getUsers = async (req,res,next) => {
  let users;
  try{
    users = await User.find( {}, '-password');  // We are using the concept of protection, and retrieved all the users with all their data except their passwords. // find is asynchronous. // find returns an array.
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again later.', 500);
    return next(error);
  }
  
  //res.json({ users: DUMMY_USERS })
  res.json({ users: users.map(user => user.toObject( {getters: true} ))});
};

const signUp = async (req,res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    
    const error = new HttpError('Invalid inputs passed, please check data entered.', 422) // when using an asynchronous function you cannot use the throw keyword instead you should use the next keyword.
    return next(error);
  }
  
  const { name, email, password } = req.body; // Mulder will now still give us the req body with this text data.

  // Functionality that checks if a user already has an account and throws an error if they do.
 let existingUser;
 try {
  existingUser = await User.findOne ( { email: email } ); // Find one literally finds one document that matches the criteria we set.
 } catch (err) {
   const error = new HttpError('Sign up failed, could not find a document relating to this user email.', 500);
   return next(error);
 }

 if (existingUser){
  const error = new HttpError('User already exists, please log in instead.', 422);
  return next(error);
}

// Functionality that adds a new user user if they don't already have an account.
  let hashedPassword;
  try{
    hashedPassword = await bcrypt.hash(password, 12) // 1st arg is the password and 2nd arg is the number of salting rounds, which basically impacts the strength of the hash. // For now 12 is a good value. //bcrypt.hash() returns a promise.
  } catch (err) {
    const error = new HttpError('Could not perform password encryption', 500);
    return next(error);
  }

  const createdUser = new User(
    {
      name: name,
      email: email,
      password: hashedPassword, // Encrypted password.
      image: req.file.path,  // We can access the file.path property because of mulder.
      places: [] // Empty starting array, but once a user adds a place then it will be added here automatically.
    }
  )
  
  try{
    await createdUser.save(); // Automatically adds it to the users collection
  } catch (err) {
    const error = new HttpError('Could not create new user', 500);
    return next(error);
  }

  // At this point the user is ceated and we can generate a token,
  let token;
  try{
    token = jwtoken.sign({userId: createdUser.id, email: createdUser.email}, process.env.PRIVATE_KEY, {expiresIn: '1h'}); // The sign method returns a string, and this string will be the token.  // It takes two arguments, 1st argument is the payload of the token (the data you want to encode into the token, this can be a string or an object for example). // The 2nd argument is the private key. // 3rd arg is the expire time.
  
  } catch(err) {
    const error =  new HttpError('Could not generate user token', 500);
    return next(error);
  }
  // This will display the password which is not safe but for now we will only do this for demonstration purposes.
  res.status(201).json( {userId: createdUser.id, email: createdUser.email, token: token} ); 
};


const logIn = async (req,res,next) => {
  const { email, password} = req.body;

 let existingUser;
try{
 existingUser = await User.findOne( { email: email} );
} catch (err) {
 const error = new HttpError('Login failed, please try again later.', 500);
 return next(error);
}

  if(!existingUser){ // We are checking if the user exists by using their email.
    const error = new HttpError('Invalid credentials, could not log you in.', 403);
    return next(error);
  }
  
  // If the user does exists then we can move on to checking their password below (we check if the password they provide matches the one saved in the database).
  let isValidPassword = false;
  try{
    isValidPassword = await bcrypt.compare(password, existingUser.password); // returns a promise. // password is the plain-text password recieved from the req. // existingUser.password is the hashed password saved in the database. // This will result in a boolean value.
  } catch (err) {
    // There won't necessarily be an error but if the conversion is unsuccessful then the above will just return false.
    const error = new HttpError('Could not fetch corresponding user password', 500);
    return next(error);
  }

  if(!isValidPassword){
    const error = new HttpError('Invalid credentials, could not log you in.', 401);
  }

  // Now that we know that the user exists and the password is correct, so we can generate a token.
  let token;
  try{
   token = jwtoken.sign({ userId: existingUser.id,  email: existingUser.email}, process.env.PRIVATE_KEY, {expiresIn: '1hr'}); // we store data in the token (1st param)
  } catch (err) {
    const error = new HttpError('Could not generate token for user on login', 500);
    return next(error);
  }

   res.json({ userId: existingUser.id, email: existingUser.email, token: token });
};

exports.getUsers = getUsers; // Pointer.
exports.signUp = signUp; // Pointer.
exports.logIn = logIn; // Pointer.