const request = require('request');


const fetchMyIP = function(callback) {
  const ip = 'https://api.ipify.org/?format=json';
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

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    
    if (error) {
      callback(error, null);
      return;
    }
    
    const location = JSON.parse(body);
    
    if (!location.success) {
      const message = `Success status was ${location.success}. Server message says: ${location.message} when fetching for IP ${location.ip}`;
      callback(Error(message), null);
      return;
    }
    
    const latLong = {
      latitude: location.latitude,
      longitude: location.longitude
    };
    
    callback(null, latLong);
  });

};


const fetchISSFlyOverTimes = function(coords, callback) {
  const lat = coords.latitude;
  const long = coords.longitude;
  
  request(`https://iss-flyover.herokuapp.com/json/?lat=${lat}&lon=${long}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    const passes = JSON.parse(body).response;
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    callback(null, passes);
  });

};
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip,(error,coords) =>{
      if (error) {
        callback(error, null);
        return;
      }
      fetchISSFlyOverTimes(coords,(error,result) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null,result);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };

