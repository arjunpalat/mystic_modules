/* Basically a console.log() and console.error() function that only logs if the environment is not test. */

const info = (...params) => {
  if(process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

const error = (...params) => {
  if(process.env.NODE_ENV !== 'test') {
    console.error(...params);
  }
};

module.exports = {
  info,
  error,
};
