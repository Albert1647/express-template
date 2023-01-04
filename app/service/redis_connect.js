const redis = require('redis');
var config = require('../../config/config.js');
// connect to redis
// const client = redis.createClient({
//     socket: {
//         host: config.redishost,
//         port: config.redisport
//     }
// })
const client = redis.createClient({
    url: config.redisURL
})

client.on('connect', function () {
    console.log('CONNECTED REDIS')
});
client.on('error', function (err) {
    console.log('error : ' + err)
});
client.connect();

module.exports = client;