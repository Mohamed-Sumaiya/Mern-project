const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const placeSchema = new Schema(
    {
      // The id will be created automatically by mongoDB when you store a document.
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true },
      address: { type: String, required: true },
      location: {
         lat: { type: Number, required: true },
         lng: { type: Number, required: true }
      },
      creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' } // Here we tell MongoDB that this is a real MongoDB ID // The ref property will allow us to establish the connection between our current place schema and another schema which would be the user schema // This will only be one user. // This will also be created automatically when the user is created so we will get it from there. // <-- Not sure 
    }
);

// We will use this in the places-controller file, in the createPlace function.
module.exports = mongoose.model('Place', placeSchema); // Our collection will be named places.  // pointer 