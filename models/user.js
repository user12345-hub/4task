const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    regDate: {type: String, required: true},
    lastLoginDate: {type: String, required: false},
    status: {type: String, default: "UnBlock"}
})

module.exports = model('users', schema)