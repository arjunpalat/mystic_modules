const logger = require("./logger");
const config = require("./config");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

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
