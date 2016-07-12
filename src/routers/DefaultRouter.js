// @flow

import { Router } from 'express';
import DefaultController from '../controllers/DefaultController';

const DefaultRouter:Function = function defaultRouter() : Router {
  const api = Router();

  // perhaps expose some API metadata at the root
  api.get('/', DefaultController.defaultEndpoint);

  // Route that triggers a sample error
  api.get('/error', DefaultController.createError);

  return api;
};

export default DefaultRouter;
