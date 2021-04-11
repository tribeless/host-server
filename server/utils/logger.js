const axios = require("axios");

const handleError = async (data)=>{
    await axios.post(process.env.LOGGING_URL, data);
}


module.exports = handleError;