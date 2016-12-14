/**
 * Created by JimGr on 2016/3/20.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var modRewrite = require('connect-modrewrite');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var less = require("gulp-less");
const imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
const rev = require('gulp-rev');//- 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');//- 路径替换


var ddaptient_jsFiles = [
    './v1/ddpatient/js/app.js',
    './v1/ddpatient/js/controllers/controllers.js',
    './v1/ddpatient/js/directives/directives.js',
    './v1/ddpatient/js/services/services.js',
    './v1/ddpatient/js/filters/filters.js',
    './v1/ddpatient/js/controllers/chatController.js'
];
var ddaptient_cssFiles = [
    './v1/ddpatient/css/style.less',
    './v1/ddpatient/css/style_weui.less',
];
//执行css文件压缩
gulp.task('ddaptient_stylesheets_min', function () {
     gulp.src(ddaptient_cssFiles)
        .pipe(less())
        .pipe(concat('ddpatient.min.css'))// 合并 CSS ，并设置合并后的文件名
        .pipe(minifyCss()) // 执行 CSS 压缩
        .pipe(rev())
        .pipe(gulp.dest('./v1/ddpatient/css'))
        .pipe(rev.manifest())//- 生成一个rev-manifest.json
        .pipe(gulp.dest('./v1/ddpatient/rev'));
    return gulp.src(['./v1/ddpatient/rev/*.json', './v1/ddpatient/index.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./v1/ddpatient/'));
});

//执行图片压缩
gulp.task('images-opt', function () {
    gulp.src('./v1/ddpatient/images/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('./v1/ddpatient/images/'));
});

//配置本地开发环境——采用未压缩的js
gulp.task('develop_ddpatient', function () {
    var target = gulp.src('./v1/ddpatient/index.html');
    var sources = gulp.src(ddaptient_jsFiles, {read: false});

    return target.pipe(inject(sources)).pipe(replace('/v1/ddpatient/js', 'js'))
        .pipe(gulp.dest('./v1/ddpatient'));
});
//配置生产环境--采用压缩后的js
gulp.task('product_ddpatient_min', function () {

    var target = gulp.src('./v1/ddpatient/index.html');
    gulp.src(ddaptient_jsFiles)
        .pipe(concat('ddpatient.min.js')) // 合并 JavaScript ，并设置合并后的文件名
        .pipe(uglify()) // 执行 JavaScript 压缩
        .pipe(gulp.dest('./v1/ddpatient/js'))

    var sources = gulp.src(['./v1/ddpatient/js/ddpatient.min.js'], {read: false});
    return target.pipe(inject(sources)).pipe(replace('/v1/ddpatient/js', 'js'))
        .pipe(gulp.dest('./v1/ddpatient'));
});

gulp.task('product_ddpatient_rev', function () {

    var target = gulp.src('./v1/ddpatient/index.html');
    gulp.src('./v1/ddpatient/js/ddpatient.min.js')
        .pipe(rev())
        .pipe(gulp.dest('./v1/ddpatient/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./v1/ddpatient/rev'));

    return gulp.src(['./v1/ddpatient/rev/*.json', './v1/ddpatient/index.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./v1/ddpatient/'));

});

//启动本地服务——叮咚门诊
gulp.task('connect_ddpatient', function () {
    connect.server({
        root: 'v1/ddpatient',
        port: 90,
        livereload: true,
        middleware: function (connect, opt) {
            return []
        }
    });
});

//启动本地服务——叮咚医邦
gulp.task('connect_dddoctor', function () {
    connect.server({
        root: 'v1/dddoctor',
        port: 90,
        livereload: true,
        middleware: function (connect, opt) {
            return []
        }
    });
});
