/*Define dependencies.*/

var express=require("express");
var multer  = require('multer');
var app=express();
var done=false;
var easyimg = require('easyimage');

var resizedFilePath = '';
/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
  },
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path);

  done=true;
  }
}));


/*Handling routes.*/

app.get('/',function(req,res){
      res.sendfile("index.html");
});

app.post('/api/photo',function(req,res){
  if(done==true){
    console.log("DONE");
    console.log(req.files);

  var width = 0;
  var height = 0;
  var uploadedFileName = '';

  easyimg.info(req.files.userPhoto.path).then(
    function(file) {
      width = file.width;
      height = file.height;
      uploadedFileName = file.name;
      console.log(width);
      console.log(height);
      console.log(uploadedFileName);

      var newWidth = Math.floor(width/2);
      var newHeight = Math.floor(height/2);

      easyimg.resize({
           src: file.path, 
           dst:'./output/' + uploadedFileName,
           width:newWidth, height:newHeight,
        }).then(
        function(image) {
          console.log('Resized ' + image.width + ' x ' + image.height);
          resizedFilePath = './output/' + uploadedFileName;
          console.log(resizedFilePath);
          res.download(resizedFilePath);
        },
        function (err) {
          console.log(err);
        }
      );

      console.log(file);
    }, function (err) {
      console.log(err);
    }
  );


  
  //res.end("File uploaded.");
  }
});

/*Run the server.*/
app.listen(3000,function(){
    console.log("Working on port 3000");
});
