const joi = require("joi")

exports.login = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next()
}

exports.register = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().required(),
        surname: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next()
}

exports.updateInformation = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    const schema = joi.object({
        name: joi.string().required(),
        surname: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().optional().allow('').min(6),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next()
}
