const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost/kitty';

const db = mongoose.connect(mongoURI, { useNewUrlParser: true });

console.log('Kitties Online');

module.exports = db