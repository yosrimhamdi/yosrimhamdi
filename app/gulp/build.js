const { src, dest, series, task } = require('gulp');
const imagemin = require('gulp-imagemin');
const gulpUsemin = require('gulp-usemin');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev');
const clean = require('gulp-clean');

const { bundleJs } = require('./scripts');
const { compileStyles } = require('./styles');
const { createServer } = require('./server');

const removePrevDistFolder = () =>
  src('./dist', { allowEmpty: true }).pipe(clean());

const copyParticlesConfig = () =>
  src('./app/assets/particles.json').pipe(dest('./dist/assets'));

const compressImages = () =>
  src('./app/assets/images/**/*.*')
    .pipe(imagemin())
    .pipe(dest('./dist/assets/images/'));

const usemin = () =>
  src('./app/index.html')
    .pipe(
      gulpUsemin({
        html: [
          () => htmlmin({ collapseWhitespace: true, removeComments: true }),
        ],
        css: [() => rev(), () => cssnano()],
        js: [() => rev(), () => uglify()],
      }),
    )
    .pipe(dest('./dist/'));

task(
  'build',
  series(bundleJs, compileStyles, compressImages, copyParticlesConfig, usemin),
);

task(
  'build:test',
  series(
    removePrevDistFolder,
    bundleJs,
    compileStyles,
    compressImages,
    copyParticlesConfig,
    usemin,
    createServer.bind(this, './dist'),
  ),
);
