import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSassFactory from 'gulp-sass';
import plumber from 'gulp-plumber';

const sass = gulpSassFactory(dartSass);

const SRC_DIR = 'src';

const paths = {
  // Every .scss file, used for the watcher.
  watch: `${SRC_DIR}/**/*.scss`,
  // Compilable entry points only — Sass partials (files prefixed with "_",
  // e.g. src/styles/abstracts/_colors.scss) never produce their own CSS
  // output, they only exist to be @use'd/@forward'ed by other files.
  entries: [`${SRC_DIR}/**/*.scss`, `!${SRC_DIR}/**/_*.scss`],
};

export function buildSass() {
  return gulp
    .src(paths.entries, { base: SRC_DIR })
    .pipe(
      plumber({
        errorHandler(err) {
          console.error(err.message);
          this.emit('end');
        },
      })
    )
    // Sass's own "compressed" output style is selector-AST-aware, so it
    // safely minifies modern selectors (e.g. :has(a b)) without mangling
    // them — unlike gulp-clean-css, which was found to corrupt the space
    // inside :has(...) arguments (turning ":has(.a b)" into ":has(.ab)").
    // NOTE: gulp-sass v6 wraps Dart Sass's modern compileString() API,
    // which takes `style`, not the legacy `outputStyle` option.
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(SRC_DIR));
}

export function watchSass() {
  gulp.watch(paths.watch, buildSass);
}

export const watch = gulp.series(buildSass, watchSass);

export default watch;
