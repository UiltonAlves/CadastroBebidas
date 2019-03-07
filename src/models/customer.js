'user strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
const customerSchema = new Schema({
        _id:{
                type:Number
        },
        nome:{
                type:String,
                required:true
        },
        email:{
                type:String,
                required:true,
                unique : true
        },
        password:{
                type:String,
                required:true

        },
        roles: [{
                type: String,
                required: true,
                enum: ['user','admin'],
                default: 'user'
            }]
});
customerSchema.plugin(autoIncrement.plugin,{ model: 'customerId', field: '_id',startAt:1});
module.exports = mongoose.model('Customer', customerSchema);