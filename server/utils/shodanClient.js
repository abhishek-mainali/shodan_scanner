const axios = require('axios');
require('dotenv').config();

const shodanClient = axios.create({
  baseURL: 'https://api.shodan.io',
  params: {
    key: process.env.SHODAN_API_KEY,
  },
});

module.exports = shodanClient;
