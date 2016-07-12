// @flow

/**
 * Represents an http error.
 *
 * This class is user by the error handler to render exceptions.
 */
class HttpError extends Error {
  status:number;
  context:{};
  message:string;
}

export default HttpError;
