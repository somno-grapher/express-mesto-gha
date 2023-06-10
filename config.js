const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

module.exports = {
  PORT,
  DB_URL,
};
