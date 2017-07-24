# portfolio-website
Kevin Lazich Web Development Portfolio


## About

The website is built from the `src/` directory, to `dist/`. The `dist` directory 
is hosted by [Google Firebase](https://firebase.google.com/) and can be visited at
[KevinLazich.com](https://kevinlazich.com).

A [lighthouse](https://developers.google.com/web/tools/lighthouse/) report can be
found at [/lighthouse-report.html](./lighthouse-report.html).

A [W3C's Unified Validator](https://validator.w3.org/unicorn/) report (for HTML and CSS) can be 
viewed [here](https://validator.w3.org/unicorn/check?ucn_uri=https%3A%2F%2Fkevinlazich.com&ucn_task=conformance#).

## To Udacity Project Reviewer




## Gulp tasks

`src/` = Source directory  
`dist/` = Destination directory

####`gulp` (default)
- Runs `clean`, `css:postcss`, `css:minify`, `html`, `js`, `img`, `fonts` and
  copies manifest.json to `dist/`.
#### `gulp clean`
- Deletes contents of `dist/`.
#### `gulp fonts`
- Copies contents of `src/font` to `dist/font`.
#### `gulp html`
- Copies `src/index.html` to `dist/` and minifies it.
#### `gulp html:validate`
- Runs `dist/index.html` through [WC3](https://validator.w3.org/) HTML validator
#### `gulp img`
- Copies contents of `src/img` (except for `src/img/org`) to `dist/img`.
#### `gulp js`
- Copies contents of `src/js` to `dist/js`.
#### `gulp css:postcss`
- Runs `src/css/styles.css` through the PostCSS plugins below and writes result to `dist/css`. 
    - `postcss-import` - Inlines `@import` lines. Combines all stylesheets into one.
    - `postcss-url` -  Rebase, inline or copy on url().
    - `postcss-discard-comments` - Removes comments in CSS.
    - `postcss-uncss` - Removes unused CSS from stylesheet.
    - `postcss-custom-properties` - Transforms CSS variables to more compatible CSS.
    - `postcss-custom-media` - Transforms custom media queries to more compatible CSS.
    - `css-mqpacker` - Packs same CSS media query rules into one.
    - `postcss-cssnext` - Transforms future CSS specs into more compatible CSS.
    - `postcss-reporter` - Passes messages from other plugins to console.log().
    - `gulp-stylefmt` - Formats stylesheets according to stylelint.
#### `gulp css:minify`
- Runs `dist/css/styles.css` through cssnano to minify and creates a sourcemap. Writes
  results to `dist/css/styles.min.css` and `dist/css/styles.min.css.map`.




