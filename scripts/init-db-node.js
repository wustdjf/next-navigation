#!/usr/bin/env node
require('ts-node').register({
  project: './tsconfig.scripts.json',
  transpileOnly: false,
  compilerOptions: {
    module: 'commonjs',
    experimentalDecorators: true,
    emitDecoratorMetadata: true
  }
});

require('./init-db.ts');
