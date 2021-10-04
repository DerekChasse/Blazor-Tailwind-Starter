const { src, dest, series, parallel, watch } = require("gulp");

const concat = require("gulp-concat");
const del = require("del");
const { pipeline } = require("readable-stream");

const fileinclude = require("gulp-file-include");

const sourcemaps = require("gulp-sourcemaps");

const postcss = require("gulp-postcss");
const postcssImport = require("postcss-import");
const tailwindcss = require("tailwindcss");
const tailwindConfig = require("./tailwind.config");
const postcssNested = require("postcss-nested");
const postcssCustomProperties = require("postcss-custom-properties");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");

const uglify = require("gulp-uglify-es").default;

// Paths
const paths = {
    html: ['**/*.html', '**/*.razor'],
    css: {
        src: "wwwroot/css/",
        dest: "wwwroot/css/dist/",
    },
    js: {
        src: "wwwroot/js/**/*.js",
        dest: "wwwroot/js/dist/",
    },
    fonts: {
        dest: "wwwroot/css/fonts/",
    },
};


// CSS
const css = () => {
    return src(paths.css.src + "style.css")
        .pipe(sourcemaps.init())
        .pipe(
            postcss([
                postcssImport(),
                tailwindcss({
                    ...tailwindConfig,
                }),
                postcssNested(),
                postcssCustomProperties(),
                autoprefixer(),
            ])
        )
        .pipe(concat("style.css"))
        .pipe(sourcemaps.write("."))
        .pipe(dest(paths.css.dest));
};

// CSS Production
const cssProd = () => {
    return src(paths.css.src + "style.css")
        .pipe(
            postcss([
                postcssImport(),
                tailwindcss({
                    ...tailwindConfig,
                    purge: {
                        enabled: true,
                        content: ['**/*.html', '**/*.razor'],
                        options: {
                            safelist: ["dark"],
                        },
                    },
                }),
                postcssNested(),
                postcssCustomProperties(),
                autoprefixer(),
            ])
        )
        .pipe(concat("style.css"))
        .pipe(cleanCSS())
        .pipe(dest(paths.css.dest));
};

// JS
const js = () => {
    return src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(concat("script.js"))
        .pipe(sourcemaps.write("."))
        .pipe(dest(paths.js.dest));
};

// JS Production
const jsProd = () => {
    return pipeline(
        src(paths.js.src).pipe(concat("script.js")),
        uglify(),
        dest(paths.js.dest)
    );
};

// Vendor
const vendor = () => {
    // Vendor Js
    const vendorJs = () =>
        src([
            // 3rd-party dependency scripts should go here.
            'node_modules/@fortawesome/fontawesome-free/js/all.min.js',
        ])
            .pipe(concat("vendor.js"))
            .pipe(dest(paths.js.dest));

    return vendorJs();
};

// Fonts
const fonts = () => {

    const fontFiles = () =>
        src([
            // Glob paths to font files (ttf/otf/woff etc...)
            'node_modules/@fortawesome/fontawesome-free/webfonts/**/*',
        ])
            .pipe(dest(paths.fonts.dest));

    return fontFiles();
};

// Clean
const clean = () => {
    console.log("Cleaning dist folder for fresh start.");

    return del([paths.css.dest, paths.fonts.dest, paths.js.dest])
};

// Development
exports.default = series(
    clean,
    parallel(css, js, vendor, fonts)
);

// Production
exports.build = series(
    clean,
    parallel(cssProd, jsProd, vendor, fonts)
);



















