// This is not a schema its just a placeholder error.
class HttpError extends Error { // It's based on the built in error but we can basically tweek it.
  constructor (message, errorCode) {
    super(message); // Forward the error meassage. //Basically inherit this from the base class. //Add a "message" property.
    this.code = errorCode; // Adds a "code" property.
  }
}

module.exports = HttpError;