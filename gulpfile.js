var gulp = require('gulp');
var util = require('gulp-util')
var gulpConnect = require('gulp-connect');
var connect = require('connect');
var cors = require('cors');
var path = require('path');
var exec = require('child_process').exec;
var portfinder = require('portfinder');
var swaggerRepo = require('swagger-repo');

var DIST_DIR = 'dist';

gulp.task('edit', gulp.series(
  function (cb) {
    exec('npm run bundle-swagger-ui', function (err, stdout, stderr) {
      console.log(stderr);
      cb(err);
    });
  },
  function () {
    portfinder.getPort({ port: 5000 }, function (err, port) {
      var app = connect();
      app.use(swaggerRepo.swaggerEditorMiddleware());
      app.listen(port);
      util.log(util.colors.green('swagger-editor started http://localhost:' + port));
    });
  }
));

gulp.task('build', function (cb) {
  exec('npm run build', function (err, stdout, stderr) {
    console.log(stderr);
    cb(err);
  });
});

gulp.task('reload', gulp.parallel('build', function () {
  gulp.src(DIST_DIR).pipe(gulpConnect.reload())
}));

gulp.task('watch', function () {
  gulp.watch(['spec/**/*', 'web/**/*'], gulp.series(['reload']));
});

gulp.task('serve', gulp.parallel('build', 'watch', 'edit', function () {
  portfinder.getPort({ port: 3000 }, function (err, port) {
    gulpConnect.server({
      root: [DIST_DIR],
      livereload: true,
      port: port,
      middleware: function (gulpConnect, opt) {
        return [
          cors()
        ]
      }
    });
  });
}));
