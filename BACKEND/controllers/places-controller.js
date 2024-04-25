const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const fs = require('fs');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../utils/location');
const Place = require('../models/place-schema');
const User = require('../models/users-schema');

  
const getPlaceById = async (req, res,next) => { 
    const placeId = req.params.pid // { pid: 'p1 }
    let place;

    try{
      place = await Place.findById(placeId) // This does not return a real promise like save() but because of mongoose we can still use async & await or then & catch because it will take a while to complete (get the id).
    } catch (err) {
       // This error will be thrown if something went wrong when finding the id.
       const error = new HttpError('Something went wrong, could not find a place', 500);
       return next(error);// Stop the code execution.
    }

   
   // This error will be thrown when the places id is not  in our database.
    if(!place){ 
      const error = new HttpError('Could not find a place for the provided id.', 404)    // for asynchrounous code = next(error); 
      return next(error); // Our code execution is stopped.
    }

    // Setting getters to true will get rid of the underscore infront of the id property.
    res.json( {place: place.toObject({getters: true}) })  // Sending back data in the form of JSON.  // {places} = {place: place}, only if the names are the same.
};


const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try{
      places= await Place.find({ creator: userId }); // Finds the places in the places collection by referencing its model(Place) of a specific user(userid). // find is not a real promise.
  
    } catch (err) {
      const error = new HttpError('Something went wrong, could not find a place', 500);
      return next(error);
    }
   
    if(!places){
      const error = new HttpError('Could not find places for the provided user id.', 404);
      return next(error); // Will reach the error midleware directly.
    }
   
    res.json({ places: places.map(place => place.toObject({getters: true}) )}) // Make the found places display as objects.
};


const createPLace = async (req, res, next) => { // using the actual address conversion function(with google api) then this should be a async and await function.
    const errors = validationResult(req); // This will look into the request object and see if there are any validation errors which were detected based on the methods we used. // This will return an errors object.
    if(!errors.isEmpty()){
      const error = new HttpError('Invalid inputs passed, please check data entered.', 422);
      return next(error);
      
    }
    const {title, description, address} = req.body;
    
    let coordinates = getCoordsForAddress(address);
    
    const  createdPlace = new Place(
      {
        title: title,
        description: description,
        address: address,
        location: coordinates,
        image: req.file.path,
        creator: req.userData.userId // Rather extract the user/creator id from the token and not diretcly from the data the user sends as this can be faked by the user.
      }
    )
    
    // Before saving the place we have to check if the user ID we recieved exists already because only we have the user created with the corresponding ID.
    let user;
    try{
      user = await User.findById(req.userData.userId); // We want to access the creator id through the token of our user and check if the id we recieved is already stored.
    } catch(err) {
      const error = new HttpError ('Creating place has failed, please try again later', 500);
      return next(error);
    }

    if(!user){
      const error = new HttpError('Could not find a user for the provided id', 404);
      return next(error);
    }
    
    //DUMMY_PLACES.push(createdPlace); // use unshift to add it infront instead of at the back.

    // If the user exists then we can add the place ID to the coreesponding user.
    try{
      // Below handles the creating of the place with the session and id.
       const session = await mongoose.startSession();// current session that starts when we want to create a new place.
       session.startTransaction(); // With this we can now tell mongoose what we want to do.
       await createdPlace.save( {session: session} ); // with this we will automatically create a new place and a unique id for our place. // set the session property to the session constant we created. // save() is still an asyncronous task.
    
      // Below we make sure that the place id is added to the corresponding user.
      user.places.push(createdPlace); // This is not the javascript push method, it is a push method provided by mongoose that allows mongoose behind the scenes to establish a connection between the two models we are referring to here. 
      
      // Now we save our newly updated user.
      await user.save( {session: session} ); // Refer to current session again to establish a connection.
      
      // Finally we make sure that the session commits the transaction here. 
      // Only at this point are the changes really saved in the database.
      await session.commitTransaction(); // An asynchronous task.
    } catch(err){
       const error = new HttpError('Creating place failed, please try again', 500);
       return next(error); // We have to add this here to stop our code execution in case we have a error and I think to also forward the error to the next middleware inline.
    }
    res.status(201).json({place: createdPlace})   // Return 201 if something was created succesfully on the server.
    // Return 200 if something was succesful.
};

 


const updatePlace = async (req, res,next) => {
   // For a patch request you also have a request body.
   const errors = validationResult(req);
   if(!errors.isEmpty()){
    const error =  new HttpError('Invalid inputs passed, please check data entered.', 422)
    return next(error);
  }

   const { title, description } = req.body;
   const placeId = req.params.pid;

   // Create a copy of the place that was updated, change the copy and once the copy is finished then change the place in the DUMMY_PLACES  with the updated copy.
   //const placeToUpdate = { ...DUMMY_PLACES.find( place => place.id === placeId) }; // Creates a new object and copies all the other objects properties and values into it.
   //const placeIndex = DUMMY_PLACES.findIndex( place => place.id === placeId)
   let place;
   // Get the place using it's id.
   try{
    place = await Place.findById(placeId);
   } catch (err) {
     const error = new HttpError('Could not find a place with the given id', 500);
     return next(error);
   }
   
   // This ony allows the place to be updated by the user that created it.
   if (place.creator.toString() !== req.userData.userId){ // place.creator is not a string but an object of type mongoose (special mongoose id that is represented as ObjectId) so we convert it to a string.
     // Now we know that this user did not create the place so we return an error.
     const error = new HttpError('You are not allowed to edit this place because you did not create it!', 401);
     return next(error);
    }
   
   place.title = title;
   place.description = description;

   //DUMMY_PLACES[placeIndex] = placeToUpdate;

   // Save the updated place.
   try{
    await place.save();
   } catch (err) {
     const error = new HttpError('Could not save the updated place', 500);
     return next(error); // Forward it to the error handling middleware.
   }

   res.status(200).json({place: place.toObject({getters: true}) }); // Convert the mongoose object to a normal javascript object.
};

// In this function we don't only want to find the place through their id but we also want to find the user that has this place ib their data.
const deletePlace = async (req,res,next) => {
   const placeId = req.params.pid;
   let place;

   // Find the place using it's id with the user it belongs to.
   try{
    place = await Place.findById(placeId).populate('creator'); // Populate will allow us to access and work with/change a document that is stored in another collection. //Here in will access the users collection and get back the data for this user id. // Populate gives us the entire user object related to this place (amazing!).
   } catch (err) {
     const error = new HttpError('Could not find place with the given id', 500);
     return next(error);
   };

  // Here we check if the place exists using it's id.
  if(!place){
    const error = new HttpError('Could not find a place for this id.', 404);
    return next(error);
  }

  if(place.creator.id !== req.userData.userId) { // because of populate , creator now holds the entire user(creator) object and not just a string.
    const error = new HttpError('You are not allowed to delete this place because you did not create it!', 403);
    return next(error);
  }

  const imagePath = place.image;

  // Delete/Remove the place.
  try{
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne( {session: session}); // Remove place from place collection.

    place.creator.places.pull(place); // Not a javascript function, this will remove the place id from the users places array.
    await place.creator.save( {session: session} ); // We can use creator like this (without accessing the places property) because populate gave us the full user object linked to this place.
    
    await session.commitTransaction(); // If everything was successful basically end the session.
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete the place', 500);
    return next(error);
  }
  
  // If this deletion fails it's not the end of the world.
   fs.unlink( // Here we delete the image for the place as well.
    imagePath,
    error => {
      console.log(error);
    }
   );

   res.status(200).json({ message: "Place removed succesfully."})
};

exports.getPlaceById = getPlaceById; // Export a pointer.
exports.getPlacesByUserId = getPlacesByUserId; // Export pointer.
exports.createPLace = createPLace; // Export a pointer.
exports.updatePlace = updatePlace; // Export pointer.
exports.deletePlace = deletePlace; // Export pointer.