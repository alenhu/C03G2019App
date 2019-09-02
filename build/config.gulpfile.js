/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
import Promise from 'bluebird';
import minimist from 'minimist';
import { merge } from 'lodash';

import babel from 'gulp-babel';
import del from 'del';
import eslint from 'gulp-eslint';
import htmlmin from 'gulp-htmlmin';
import gulpIf from 'gulp-if';
import makeDir from 'make-dir';
import nodemon from 'gulp-nodemon';
import open from 'open';
import recursiveReaddir from 'recursive-readdir';
import replace from 'gulp-replace';
import runSequence from 'run-sequence';
import shell from 'gulp-shell';
import tar from 'gulp-tar';
import log from 'fancy-log';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import pkg from '../package.json';

const config = {};
const argv = minimist(process.argv.slice(2));

const dir = config.dir = {
  frontend: 'app',
  backend: 'lib',
  config: 'config',
  configEnv: `config-env/${argv.env || 'production'}`,
  log: 'logs',
  dist: 'dist',
  distPkg: `dist/${pkg.name}`
};

config.$ = {
  babel,
  del,
  eslint,
  htmlmin,
  if: gulpIf,
  makeDir,
  nodemon,
  open,
  recursiveReaddir,
  replace,
  runSequence: Promise.promisify(runSequence),
  shell,
  tar,
  log,
  webpack: Promise.promisify(webpack),
  WebpackDevServer
};

config.pkg = pkg;

config.argv = argv;

config.dev = merge(
  {},
  require(`../${dir.config}/base`).default,
  require(`../${dir.config}/config`).default
);

config.pro = merge(
  {},
  require(`../${dir.config}/base`).default,
  require(`../${dir.configEnv}/config`).default
);

export default config;
