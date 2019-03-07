'user strict';
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async() => {
    const res = await Customer.find({},'nome email roles');
    return res;
}

exports.getById =async(id) => {
    const res = await Customer.findById(id,'nome email roles');
    return res;
}

exports.create = async(data) => {
   var customer = new Customer(data);
    await customer.save();     
}

exports.update = async(id, data) => {

    await Customer.findByIdAndUpdate(id, {    
                        $set: {     
                            nome: data.nome,
                            email: data.email,
                            password: data.password,
                            roles: data.roles
                        }
    });
           
}
exports.authenticate = async(data) => {
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}
