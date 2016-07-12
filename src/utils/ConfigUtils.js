// @flow

import nconf from 'nconf';

/**
 * @todo Validate the configuration
 */
class ConfigUtils {
  /**
   * Return all the parameters of the application.
   *
   * @returns {{env: string}}
   */
  static getConfig() : any {
    nconf.file('./config/parameters.json').env();

    const env:string = nconf.get('NODE_ENV') || 'local';

    const config:any = nconf.get(env);

    const application = config.application;

    config.applicationUrl = `${application.scheme}://${application.domain}:${application.port}`;

    config.env = env;

    return config;
  }
}

export default ConfigUtils;
