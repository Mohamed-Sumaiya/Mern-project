const API_KEY = process.env.GOOGLE_API_KEY; //'kjjiuhsdwddF_vhwnjnuwhdqomdmRinnLihiug' // This is where the actual google API KEY should go but for now I put a Dunnmy api key.

/* Function that that takes an address and reaches out to googles api and converts it to coordinates.
async function getCoordsForAddress(address) {
    // Install the axios package (npm install axios), axios is a popular for sending http requests from front-end applications to backends but this package can also be used on a node server to send a request from there.
    // require axios in this file.
    // require the HttpError in this file.
   const response = await axios.get(`https://maps.googleleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`) // Example of how this should look but you will get the actuall http link in the google geocode docs and you mut just add the other variables.
   const data = response.data;

   if(!data || data.status === 'ZERO_RESULTS') {
     const error = new HttpError('Could not find location for the specified address.', 404)
      throw error; // The promise will also throw this error.
    }

    const coordinates = data.results[0].geometry.location;
    return coordinates;
}
*/
// Dummy version of the address convertion function (above).
const getCoordsForAddress = (address) => {
   return {
     lat: 40.7484405,
     lng: -109.8450394,
   };
};

module.exports = getCoordsForAddress; // Pointer.
