// Import both http & https for handling different uris
var http = require('http');
var https = require('https');
// in order to write to the filesystem we need the `fs` lib
var fs = require('fs');
// import the lib
var sharp = require('sharp');

var imageUri = 'https://images.unsplash.com/photo-1427805371062-cacdd21273f1?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&s=7bd7472930019681f251b16e76e05595';

resizeImage(imageUri, 300, 300)
.then((thumbnailPath) => console.log('DONE', thumbnailPath))
.catch((err) => console.log(err));

function resizeImage(imageUri, width, height) {
  // create the resize transform
  var resizeTransform = sharp().resize(width, height).max();
  return new Promise((resolve, reject) => {
    // determine wether we need to use `http` or `https` libs
    var httpLib = http;
    if ( /^https/.test(imageUri) ) {
      httpLib = https;
    }
    // begin reading the image
    httpLib.get(imageUri, function(downloadStream) {
      var outPath = `./output-${ width }x${ height }.jpg`;
      var writeStream = fs.createWriteStream(outPath);
      downloadStream.pipe(resizeTransform).pipe(writeStream);
      downloadStream.on('end', () => resolve(outPath));
      writeStream.on('error', reject);
      downloadStream.on('error', reject);
      resizeTransform.on('error', reject);
    });
  });
}
