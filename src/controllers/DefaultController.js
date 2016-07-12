// @flow

import { $Response, $Request, NextFunction } from 'express';
import HttpError from '../errors/HttpError';

class DefaultController {
  /**
   * Default endpoint of the application.
   * @param req
   * @param res
   */
  static defaultEndpoint(req : $Request, res : $Response) {
    res.json({
      version: '1.0',
    });
  }

  /**
   * Create sample error.
   * @param req
   * @param res
   * @param next
   */
  static createError(req : $Request, res : $Response, next : NextFunction) {
    const err = new HttpError('Sample error');
    err.status = 500;

    next(err);
  }
}

export default DefaultController;
