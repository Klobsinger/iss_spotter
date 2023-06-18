const request = require('request');
const ip = 'https://api.ipify.org/?format=json';

const fetchMyIP = function(callback) {
  request(ip, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response ${body}`;
      callback(Error(msg),null);
      return;
    }
    const data = JSON.parse(body);
    const ipAddress = data.ip;
    callback(null, ipAddress);
  });
};

module.exports = { fetchMyIP };