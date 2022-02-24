
const express                     = require('express');
const bodyParser                  = require('body-parser');
const { join, resolve }           = require('path');
const cors                        = require('cors');
const fs                          = require('fs');
const multer                      = require('multer');
const app                         = express();

const jsonDir = resolve(__dirname+'/json');

app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb', parameterLimit: 100000})); 
app.use(cors());

/**
 * Сохранялка файлов
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        
        cb(null, jsonDir)
    },
    filename: function(req, file, cb) {
        let name = file.originalname.split("_____")[2];
       
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 1000000,
    },
});

const upload = multer({ storage: storage });

/*
 * route
 */
app.get('/', (req, res)=>{
  res.sendFile(join(__dirname,'/mcef.html'))
});

app.post('/save-json', upload.single('file'), (req, res)=>{
    console.log('req')
    res
        .status(200)
        .contentType("text/plain")
        .end("File uploaded!")
})

app.get('/json-dir', (req, res)=>{
    fs.readdir(jsonDir, function(err, items) {
      if(err){
        console.error(err);
        res.send(err);
      }
      res.send(items)
    });
});


app.get('/json-file', (req, res)=>{
    let fileName = req.query.fileName;

    fs.readFile(join(__dirname+'/json/'+fileName), 'utf8', function(err, contents) {
        if(err){
          console.error(err);
          res.send(err);
        }
        res.send(contents);

    });
})



app.listen(8081, ()=>{
  console.log('[start] http://localhost:'+8081)
})
