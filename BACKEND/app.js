const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express(); //Executing our app.

// Register the middleware.
app.use(bodyParser.json()) // This will extract any json data and convert it into regular javascript object or array and call next automatically so that the next middleware function in line gets called.

// Middleware function to prevent the CORS error.  // Here we will set headers.
app.use((req, res, next) => {
 // The idea here is to not send back a response but add certain headers to the all responses so that when an actual response is sent using our  routes and their functions then the headers will already be set.
 res.setHeader('Access-Control-Allow-Origin', '*' ); // This sets headers on the response. // Here we will set 3 headers.
 res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization') // This will specify which headers the requests sent by the browser may have. 
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE') // This basically controls which HTTP methods may be used on the front-end.
 next()// We call next to let the request continue it's journey to other middlewares.
});

app.use('/api/places', placesRoutes); // Don't need to repeat the same root  in the app.js file but this is what the root will start with.

app.use('/api/users', usersRoutes);

// middleware function for file uploads.
// Files are locked down but files in this folder if requested are returned.
app.use('/uploads/images', express.static( 
   // Here we have to control which files and which folder we want to return.
   // Express.static wants a path pointing at the folder from which you want to serve files from without any extra checks. // The path needs to be an abosolute path and we can built this with the path module which is built into Node.js.
   // Now we pass our build path where we join two segmants uploads.
   path.join('uploads','images') // this builds a new path pointing at the uploads images folder and any file in there.
 )
)

// Proper error handeling for unsupported routes.
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error // You can also call next(), but this code is synchronous so we can just throw the error.
  // The above will reach our default error handler to send the error message.
})  

// Here we will check if we have a file uploaded when a related error occurs and roll back the upload(delete it).
app.use((error, req, res, next) => {  // Error handling middleware. // Special middleware because it has 4 params that express will recognise as a error handling middleware fuction.  // Will be executed on req's that have an error attached to it(where an error was thrown).
  if (req.file) {
    fs.unlink(
      req.file.path, // Point to the file you want to delete using the file path property that exists on the file object that mulder adds to the req.
      (error) => { // Callback function that will be triggered when the deletion is done.
        console.log(error);      }
    ); 
  }
  if (res.headerSent){ // Check if a res has already been sent.
    next(error) // Forward the error because a response was somehow already sent and we can only send 1 res.
  } else {
    res.status(error.code || 500); // If no code is available then fallback to the defualt status code.
    res.json({message: error.message || "An unknown error occurred!" });
 }
})


// We use mongoose here, where we start up our backend server.
// We first want to establish the connection to the database.
// If this connection is successful, then we want to start our back end server.
// If the connection(to the database) was unsuccessful then we will throw an error.
// After all the middleware functions and after we connect to the database add a listen function to start up the port(server).
mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-practice-cluster.pddnpbd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Mern-practice-cluster`) // The database is mern and no it was not created beforehand.
  .then(() => {
    // If our connection was successful.
    app.listen(5000);
  })
  .catch( error => {
    // If our connection was not successful.
    console.log(error);
  })


