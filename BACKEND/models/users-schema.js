const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
       name: {type: String, required: true},
       email: {type: String, required: true, unique: true}, // unique prop will create an internal index for the email so that it is queried faster.
       password: {type: String, required: true, minlength: 6 }, // minlength prop adds validation.
       image: {type: String, required: true},
       places: [{type: mongoose.Types.ObjectId, required: true, ref: 'Place'}] // This will be an array of places.
    }
);

userSchema.plugin(uniqueValidator); // This will make sure that when a user creates a profile their email is unique.

module.exports = mongoose.model('User', userSchema) // This will create a users collection.