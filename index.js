'use strict';

const BbPromise = require('bluebird');
const pack = require('./lib/pack');
const getPackingInfo = require('./lib/pack');
const funcRuntimeIsDotNet = require('./lib/pack');

class ServerlessDotNet {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    if (!options["nopack"]) {
      Object.assign(this, pack);
      Object.assign(this, getPackingInfo);
      Object.assign(this, funcRuntimeIsDotNet);
      this.hooks = {
        'before:package:createDeploymentArtifacts': () => BbPromise.bind(this).then(this.pack)
      };
    }
    serverless.configSchemaHandler.defineFunctionProperties(Object.keys(serverless.providers)[0], {
      properties: {
        projectPath: {type: 'string'},
      }, required: [],
    });
  }
}

module.exports = ServerlessDotNet;
