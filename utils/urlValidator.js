const validator = require('validator');

const validateURL = ((value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Необходимо использовать ссылку');
});

module.exports = { validateURL };
