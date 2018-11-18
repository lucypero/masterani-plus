/* eslint-env node */
import fs from "fs";
import gulp from 'gulp';
import {merge} from 'event-stream'
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import preprocessify from 'preprocessify';
import gulpif from "gulp-if";

const $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var production = process.env.NODE_ENV === "production";
var target = process.env.TARGET || "chrome";
var environment = process.env.NODE_ENV || "development";

var generic = JSON.parse(fs.readFileSync(`./config/${environment}.json`));
var specific = JSON.parse(fs.readFileSync(`./config/${target}.json`));
var context = Object.assign({}, generic, specific);
const eslint = require('gulp-eslint');

var manifest = {
  dev: {
    "background": {
      "scripts": [
        "scripts/debug/livereload.js",
        "scripts/debug/debug-bg.js",
      ]
    }
  },

  firefox: {
    "applications": {
      "gecko": {
        "id": "masteraniplus@matiaspier.addons.mozilla.org",
        "strict_min_version": "42.0"
      }
    },
    "options_ui": {
      "browser_style": true
    }
  },

  chrome: {
    "update_url": "https://clients2.google.com/service/update2/crx",
    "options_ui": {
      "chrome_style": true
    }
  }
}

// Tasks
gulp.task('clean', () => {
  return pipe(`./build/${target}`, $.clean())
})

gulp.task('build', (cb) => {
  runSequence('clean', 'styles', 'ext', cb)
})

gulp.task('watch', ['build'], () => {
  $.livereload.listen();

  gulp.watch(['./src/**/*']).on("change", () => {
    runSequence('build', $.livereload.reload);
  });
  // gulp.watch(['./src/**/*'], gulp.series('build', 'reload'))
});

gulp.task('default', ['build']);

gulp.task('ext', ['manifest', 'js'], () => {
  return mergeAll(target)
});


// -----------------
// COMMON
// -----------------
gulp.task('js', ['lint'], () => {
  return buildJS(target)
})

gulp.task('styles', () => {
  return gulp.src('src/styles/**/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe(gulp.dest(`build/${target}/styles`));
});

let mergeJsonOpt = (endObj) => { return {
    fileName: "manifest.json",
    jsonSpace: " ".repeat(4),
    endObj: endObj,
    customizer: (objA, objB) => {
      // Example: Concat arrays but only keep unique values
      if (Array.isArray(objA) && Array.isArray(objB)) {
        return objA.concat(objB).filter((item, index, array) => (
          array.indexOf(item) === index
        ));
      }

      return undefined;
    }
  }
}

gulp.task("manifest", () => {
  return gulp.src('./manifest.json')
    .pipe(gulpif(!production, $.mergeJson(mergeJsonOpt(manifest.dev))))
    .pipe(gulpif(target === "firefox", $.mergeJson(mergeJsonOpt(manifest.firefox))))
    .pipe(gulpif(target === "chrome", $.mergeJson(mergeJsonOpt(manifest.chrome))))
    .pipe(gulp.dest(`./build/${target}`))
});



// -----------------
// DIST
// -----------------
gulp.task('dist',(cb)=>{
  runSequence('build','zip', cb)
})

gulp.task('zip', () => {
  return pipe(`./build/${target}/**/*`, $.zip(`${target}.zip`), './dist')
})


// Helpers
function pipe(src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string'
    return stream.pipe(isDest ? gulp.dest(transform) : transform)
  }, gulp.src(src))
}

function mergeAll(dest) {
  return merge(
    pipe('./src/icons/**/*', `./build/${dest}/icons`),
    pipe(['./src/_locales/**/*'], `./build/${dest}/_locales`),
    pipe([`./src/images/${target}/**/*`], `./build/${dest}/images`),
    pipe(['./src/images/shared/**/*'], `./build/${dest}/images`),
    pipe(['./src/**/*.html'], `./build/${dest}`),
    pipe(['./src/credits.txt'], `./build/${dest}`)
  )
}

function buildJS(target) {
  const files = [
    'contentscript.js',
    'popup.js',
    'mp4.js',
    'options.js'
  ]
  const devFiles = [
    'debug/debug-bg.js',
    'debug/livereload.js',
  ]

  let tasks = files.concat(devFiles).map( file => {
    return browserify({
      entries: 'src/scripts/' + file,
      debug: true
    })
    .transform('babelify', { presets: ['es2015'] })
    .transform(preprocessify, {
      includeExtensions: ['.js'],
      context: context
    })
    .bundle()
    .pipe(source(file))
    .pipe(buffer())
    .pipe(eslint.failAfterError())
    .pipe(gulpif(!production, $.sourcemaps.init({ loadMaps: true }) ))
    .pipe(gulpif(!production, $.sourcemaps.write('./') ))
    .pipe(gulpif(production, $.uglify({ 
      "mangle": false,
      "output": {
        "ascii_only": true
      } 
    })))
    .pipe(gulpif((production && !devFiles.includes(file)) || !production,gulp.dest(`build/${target}/scripts`)));
  });
  

  return merge.apply(null, tasks);
}

gulp.task("lint", function() {
  gulp.src('src/scripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
});