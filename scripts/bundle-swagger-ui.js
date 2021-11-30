#!/usr/bin/env node
'use strict';
var Path = require('path');

var TARGET_DIR = 'dist'
if (process.argv[2]) {
    TARGET_DIR = process.argv[2]
}

require('shelljs/global');
set('-e');

mkdir('-p', TARGET_DIR);

var SWAGGER_UI_DIST = Path.dirname(require.resolve('swagger-ui'));
rm('-rf', TARGET_DIR + '/swagger-ui/')
cp('-R', SWAGGER_UI_DIST, TARGET_DIR + '/swagger-ui/')
sed('-i', 'http://petstore.swagger.io/v2/swagger.json', '../swagger.json', TARGET_DIR + '/swagger-ui/index.html')
