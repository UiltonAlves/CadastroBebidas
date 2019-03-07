'user strict';
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repositories');
const md5 = require('md5');
const authService = require('../services/auth-service');

exports.post = async(req, res, next) => {  

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.nome, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try{
             await repository.create({
                nome: req.body.nome,
                email: req.body.email,
                password: md5(req.body.password + global.JWTKEY),
                roles: req.body.roles ? req.body.roles:"user"
            });         
            res.status(201).send({message:'Usuario cadastrado com sucesso!'});
    }catch(e){

        res.status(500).send({message: e +' Falha ao processar sua requisição'});
    }
};

exports.get = async(req, res, next) => {
    try{
            const data = await repository.get();
             res.status(200).send(data);
    }catch (e){
            res.status(500).send({
                    message: 'Falha ao processar sua requisição'
            });
    } 
};

exports.getById = async(req, res, next) => {
    try{
        var data = await repository.getById(req.params.id);                       
         res.status(200).send(data);
    }catch(e){
        res.status(500).send({
                message: 'Falha ao processar sua requisição'
        });
    }

};

exports.put = async(req, res, next) => {
    try{    
    await repository.update(req.params.id,
                {
                    nome: req.body.nome,
                    email: req.body.email,
                    password: md5(req.body.password + global.JWTKEY),
                    roles: req.body.roles
                }
    );
        res.status(200).send({
            message: 'Usuario atualizado com sucesso!'
        });
    }catch(e){
        res.status(500).send({       
            message: 'Falha ao processar sua requisição'});
    }
    
};

exports.authenticate = async(req, res, next) => {
    try {
        
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password+global.JWTKEY)
        });
        
        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }
        const token = await authService.generateToken({
            id: customer.id,
            email: customer.email,
            nome: customer.nome,
            roles: customer.roles,
        });

        res.status(201).send({
            token: token,
            data: {
                id: customer.id,
                email: customer.email,
                nome: customer.nome,
                roles: customer.roles,
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição' + e
        });
    }
};
exports.refreshToken = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer.id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                id: customer.id,
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

