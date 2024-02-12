# Serverless Multi DotNet

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-multi-dotnet.svg)](https://badge.fury.io/js/serverless-multi-dotnet)
[![license](https://img.shields.io/npm/l/serverless-multi-dotnet.svg)](https://www.npmjs.com/package/serverless-multi-dotnet-v3)

A Serverless plugin to pack all your C# lambdas functions that are spread to multiple CS projects.

This plugin will go over all of your functions that have .net core 2.0 runtime defined in `serverless.yml` file take the value from package.artifact 

It would split the value on first path separator and use first part of a string as location for a CS project folder and the rest as a path for a file. 

You must to specify 2 properties.
`artifact`: the zip package that will be deployed to lambda
`projectPath`: the location of the dotnet project file from which the lambda package to be created 


Here the example of the definition:
```
function:
    projectPath: src/app/function1/function1.csproj
    package:
        artifact: src/app/function1/publish/deploy-package.zip  
```

## Install

```
npm install serverless-multi-dotnet-v3
```

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-multi-dotnet-v3
```

## Note
This work is based on @tsibelman [serverless-dotnet plugin](https://github.com/tsibelman/serverless-multi-dotnet)

