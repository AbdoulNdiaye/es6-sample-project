// @flow

import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from './utils/ConfigUtils';
import fs from 'fs';
import path from 'path';
import FileStreamRotator from 'file-stream-rotator';
import log4js from 'log4js';
import HttpError from './errors/HttpError';
import { EventEmitter } from 'events';
import express, { $Response, $Request, NextFunction } from 'express';
import _ from 'lodash';

import DefaultRouter from './routers/DefaultRouter';

const app = express();

/**
 * Configuration.
 */
const properties = config.getConfig();

/**
 * Logger setup.
 */
const logDirectory = './log';

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false,
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

const logger = log4js.getLogger();
logger.setLevel('TRACE');

if (properties.env === 'prod') {
  log4js.configure({
    appenders: [
      {
        type: 'console',
        layout: { type: 'basic' },
      },
    ], replaceConsole: true,
  });
}

app.use(log4js.connectLogger(logger, {
  level: log4js.levels.DEBUG,
  format: ':method :url - :status - :response-time ms',
}));

/**
 * Application specifics
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(compression());
const emitter = new EventEmitter();
emitter.setMaxListeners(100);

/**
 * Routers
 */
app.use('/', DefaultRouter());

/**
 * 404
 */
app.use(function fallback404(req : $Request, res : $Response, next : NextFunction) {
  const error404 = new HttpError();

  error404.status = 404;
  error404.message = `Route ${req.originalUrl} not found.`;

  next(error404);
});


/**
 * Error fallback
 */
app.use(function errorFallBack(
  err : HttpError,
  req : $Request,
  res : $Response,
  next : NextFunction
) {
  logger.error(err);

  const response : { status: number, message: string, context: any } = {
    status: err.status || 500,
    message: err.message || 'Internal error',
    context: undefined,
  };

  if (err.context !== undefined) {
    response.context = err.context;
  } else {
    _.unset(response, 'context');
  }

  res.status(response.status).send(response);
});

/**
 *   server - http
 */
const server = app.listen(properties.application.port, () => {
  const { address, port } = server.address();
  logger.info(`Environment = ${properties.env}`);
  logger.info(`Api listening at http://${address}:${port}`);
});
