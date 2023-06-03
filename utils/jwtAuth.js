const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super_secret';

const checkToken = (token) => jwt.verify(token, SECRET_KEY);

const signToken = (payload) => jwt.sign(payload, SECRET_KEY);

module.exports = { checkToken, signToken };
