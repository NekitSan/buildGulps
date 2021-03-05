let preprocessor = 'sass';
const dist = 'project/';

const { src, dest, parallel, series, watch } = require('gulp');

const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default; // compressor js
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss     = require('gulp-clean-css'); // compressor
const imagemin     = require('gulp-imagemin'); // compressor
const imageminJPG  = require('imagemin-jpeg-recompress'); // compressor
const del          = require('del');
const fileinclude  = require('gulp-file-include');


function browsersync()
{
    browserSync.init({
        server: { baseDir: dist },
        tunnel: "test",
        notify: false,
        online: true //по локалке
    });
}

function html()
{
    return src([
        'app/*.html',
        "!app/_*.html"
    ])
    .pipe(fileinclude())
    .pipe(dest(dist))
    .pipe(browserSync.stream());
}


function scripts()
{
    return src([
        'app/scripts/app.js'
    ])
    .pipe(fileinclude())
    .pipe(dest(dist + 'scripts/'))
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest(dist + 'scripts/'))
    .pipe(browserSync.stream());
}

function styles()
{
    return src([
        'app/' + preprocessor + '/index.' + preprocessor + ''
    ])
    .pipe(fileinclude())
    .pipe(eval(preprocessor)())
    .pipe(dest(dist + 'style/'))
    .pipe(concat('index.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'], grid: true
    }))
    .pipe(cleancss(( { level: { 1: { specialComments: 0 } }/*, format: 'beautify'*/ } )))
    .pipe(dest(dist + 'style/'))
    .pipe(browserSync.stream());
}

function images()
{
    return src('app/images/**/*')
    .pipe(imagemin([
        imageminJPG({
            loops: 4,
            min: 50,
            max: 95,
            quality: 'medium'
        }),
        imagemin.gifsicle({interlaced: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest(dist + 'images/'));
}

function addReadMe()
{
    return src([
        'app/README.md'
    ])
    .pipe(dest(dist))
    .pipe(browserSync.stream());
}

function cleanimg()
{
    return del('app/images/**/*', { force: true });
}

function cleandist()
{
    return del(dist + '**/*', { force: true });
}

function startwatch()
{
    watch(["app/**/*.html"], html);
    watch( 'app/**/' + preprocessor + '/**/*', styles);
    watch([
        'app/**/*.js',
        '!app/**/*.min.js'
    ], scripts);
    watch( 'app/images/**/*.{png,jpg,svg}', images);
    watch( 'app/*.md', addReadMe );
}

let build           = series(cleandist, cleanimg, parallel(styles, scripts, html, images, addReadMe));
let watched         = parallel(build, browsersync, startwatch);

exports.browsersync = browsersync;
exports.html        = html;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.cleandist   = cleandist;
exports.addReadMe   = addReadMe;

exports.bild        = build;
exports.default     = watched;