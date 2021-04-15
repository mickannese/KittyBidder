const mongoose = require('mongoose');
const db = require('./index.js');
mongoose.Promise = global.Promise;

const KittySchema = new mongoose.Schema({
  name: String,
  exp: { type: Number, default: 1 }
});

const Kitty = mongoose.model('kitty', KittySchema);

const addKitty = (name, cb) => {
  Kitty.find({ name: name })
    .then(result => {
      if (result.length > 0) {
        //this kitty already exists
        cb(false);
      } else {
        Kitty.create({ "name": name }).then((result) => {
          cb(result);
          console.log(`Created Kitty: ${name}`)
        })
      }
    })
};

const addExp = (name, cb) => {
  Kitty.findOneAndUpdate({ name: name }, { $inc: { exp: 1 } }, { new: true })
    .then(result => {
      if (result.length < 1) {
        cb(false)
      } else {
        cb(result)
      }
    })
}

const getKitties = (cb) => {
  Kitty.find()
    .then(result => {
      cb(result)
    })
}

module.exports.addKitty = addKitty;
module.exports.getKitties = getKitties;
module.exports.addExp = addExp;