const imagemin = require('imagemin')
const webp = require('imagemin-webp')
const outputFolder = 'src/img/webp'
const PNGImages = 'src/img/**/*.png'
const JPGImages = 'src/img/**/*.jpg'

imagemin([PNGImages], outputFolder, {
  plugins: [webp({lossless: true})],
})

imagemin([JPGImages], outputFolder, {
  plugins: [webp({quality: 65})],
})
