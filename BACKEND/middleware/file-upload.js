const multer = require('multer');
const { v1: uuidv1 } = require('uuid');

const MIME_TYPE_MAP = {
    // With this I can derive the correct extension for the identified mime type.
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const fileUpload = multer({
    // We can configure it  and tell it where to store something and also which files to accept.
    limits: 500000, // 500000 bytes to have an upload limit of 500 kilobytes.
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
           callBack(null, 'uploads/images') // null if the validation succeded or error if there was an error. // first arg error or null if theres no error, null if its successful.
        },
        filename: (req, file, callBack) => {
          const ext = MIME_TYPE_MAP[file.mimetype] // dynamicaly access the mime type in the mime_type_Object to get a corresponding value.
          callBack(null, uuidv1() + '.' + ext) // This generates a random file name with the right extension.
        }
    }), // Here we can control how data get stored.
    fileFilter: (req, file, callBack) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype]; // Check if you can find the file mime_type in the mime_type object. // If it doesnt find a corresponding value then it will return undefined. // the double bang(!!) operator converts undefined or null to false. // it basically convert whatever value this will be to true (if its a file) or false (if its null or undefined) 
      let error = isValid ? null : new Error('Invalid mime type (file type)')
      callBack(error, isValid); // first arg is the error and second is a boolean value that informs Mulder if we accept the file or not.
    }
});

module.exports = fileUpload;