const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'ZG6obxFAUhbXGsbnD9w8ve06bZl6iAwS',
    formatter: null
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder