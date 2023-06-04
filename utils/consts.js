const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  DEFAULT: 500,
  MONGO_DUPLICATED_KEY: 11000,
};

module.exports = STATUS_CODES;