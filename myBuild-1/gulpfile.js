let preprocessor = 'sass';
const dist = require("path").basename(__dirname) + '/';

const { src, dest, parallel, series, watch } = require('gulp');

const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default; // compressor js
const autoprefixer = require('gulp-autoprefixer');
const sass         = require('gulp-sass');
const less         = require('gulp-less'); 
const cleancss     = require('gulp-clean-css'); // compressor
const imagemin     = require('gulp-imagemin'); // compressor
const imageminJPG  = require('imagemin-jpeg-recompress'); // compressor
const fileinclude  = require('gulp-file-include');
const del          = require('del');
const webp         = require('gulp-webp');
const webpHTML     = require('gulp-webp-html');
const webpCSS      = require('gulp-webpcss');

function browsersync()
{
    browserSync.init({
        server: { baseDir: dist },
        // tunnel: "test",
        port: 3000,
        notify: false, //false
        online: true //по локалке
    });
}

function html()
{
    return src([
        'app/*.html',
        "!app/**/_*.html"
    ])
    .pipe(fileinclude())
    .pipe(webpHTML())
    .pipe(dest(dist))
    .pipe(browserSync.stream());
}


function scripts()
{
    return src([
        'app/scripts/*.js'
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
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'], grid: true
    }))
    .pipe(
        webpCSS({
            webpClass: '.webp',
            noWebpClass: '.no-webp'
        })
    )
    .pipe(dest(dist + 'style/'))
    .pipe(concat('index.min.css'))
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
    .pipe(dest(dist + 'images/'))
    .pipe(
        webp({
            quality: 80
        })
    )
    .pipe(dest(dist + 'images/'));
}

function gitReadMe()
{
    return src('app/ReadMe.md')
    .pipe(dest(dist));
}

function cleandist()
{
    return del(dist + '**/*', { force: true });
}

function startwatch()
{
    watch( 'app/**/' + preprocessor + '/**/*', styles);
    watch([
        'app/**/*.js',
        '!app/**/*.min.js'
    ], scripts);
    watch('app/**/*.html', html);
    watch( 'app/images/**/*.{jpg,png,svg,gif,ico,webp}', images);
}

let build           = series(cleandist, parallel(styles, scripts, html), images, gitReadMe);
let watched         = parallel(build, startwatch, browsersync);

exports.browsersync = browsersync;
exports.html        = html;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleandist   = cleandist;
exports.gitReadMe   = gitReadMe;

exports.build       = build;
exports.default     = watched;