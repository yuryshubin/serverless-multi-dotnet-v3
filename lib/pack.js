'use strict';

const BbPromise = require('bluebird');
const program = require('child_process');
const path = require('path');

function getLambdaPackageFlags(service) {

  let myFramework = '';
  var frameworkList = {
    "dotnet6": "net6.0" //can add more mappings for more support
  };
  if (service.provider.runtime && frameworkList[service.provider.runtime]) {
    myFramework = ' -f ' + frameworkList[service.provider.runtime];
  }
  let architecture = '';
  if (service.provider.architecture) {
    architecture = ' -farch ' + service.provider.architecture
  }
  return architecture + myFramework;
}
module.exports = {

  getPackingInfo() {
    let service = this.serverless.service;
    return service.getAllFunctions().reduce((dotnetPackages, funcName) => {
      let func = service.getFunction(funcName);

      if (this.funcRuntimeIsDotNet(service, func))
        dotnetPackages.push({artifact: func.package.artifact, project: func.projectPath});

      return dotnetPackages;
    }, [])
  },

  funcRuntimeIsDotNet(service, func) {
    let providerRuntime = service.provider.runtime;
    let funcRuntime = func.runtime;

    if (!providerRuntime && !funcRuntime) {
      console.error('No runtime found at global provider or local function level, eg. dotnetcore2.1')
    }

    return (providerRuntime && providerRuntime.startsWith('dotnet') && !funcRuntime)
      || (funcRuntime && funcRuntime.startsWith('dotnet'))
      || (!providerRuntime && funcRuntime && funcRuntime.startsWith('dotnet'));
  },

  pack() {
    let cli = this.serverless.cli;
    let flags = getLambdaPackageFlags(this.serverless.service)
    cli.log('Serverless DotNet: Pack');
    const dicInfo = this.getPackingInfo();
    var promises = Object.entries(dicInfo).map(kv => {
      return new BbPromise(function (resolve, reject) {

        try {
          const packingInfo = kv[1];
          
          if(!packingInfo.project)
            return reject(new Error('projectPath not specified'));
          
          const diff = path.relative(path.dirname(packingInfo.project), packingInfo.artifact);
          cli.log(`packaging project at ${packingInfo.project}...`);
          
          var output = program.execSync('dotnet lambda package ' + flags + ' -o ' + diff, { "cwd": path.dirname(packingInfo.project) }, function (error, stdout, stderr) {
            console.log(output)
            cli.log(stdout);

            if (error) {
              console.error('An error occured while restoring packages');
              console.error(err.stdout.toString('utf8'));
              console.error(err.toString('utf8'));
              process.exit();
              return reject(err);
            }

            console.log('Publishing');

            return resolve();
          });

          cli.log(output);
          return resolve();
        } catch (err) {
          console.error('An error occured while restoring packages');
          console.error(err.stdout.toString('utf8'));
          console.error(err.toString('utf8'));
          process.exit();
          return reject(err);
        }
      })
    });

    return BbPromise.all(promises);
  }
};
