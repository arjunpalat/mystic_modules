/* Custom middleware functions */

const logger = require("./logger");
const config = require("./config");

/* Middleware to log the request method, path, body and time of the request */
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

/* Middleware to handle unknown endpoints */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

/* Middleware to handle Mongoose errors */
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError" && error.code === 11000) {
    const objectAttribute = error.errorResponse.keyValue;
    const key = Object.keys(objectAttribute)[0];

    return response.status(400).json({
      error: `There exists another object with similar attribute having (key, value) as (${key}, ${objectAttribute[key]}). Please provide a unique value for the operation.`,
    });
  }

  next(error);
};

/* Middleware to check if the request has a valid token in the Authorization header */
const checkAuthorization = (request, response, next) => {
  const authorization = request.get("Authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.substring(7);
    if (request.token === config.SECRET) {
      return next();
    }
  }
  return response.status(401).json({ error: "Unauthorized" });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  checkAuthorization,
};
