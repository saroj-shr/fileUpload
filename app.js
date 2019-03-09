const PORT = process.env.PORT || 5000;
const PATH = 'data/images';

const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const Image = require('./model/Images');

const app = express();


// view engine
app.set('view engine', 'ejs');
app.set('views');

// use body-parser 
app.use(bodyParser.urlencoded({
    extended: false
}));

// helmet
app.use(helmet());
// compression
app.use(compression());
//morgan
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);
app.use(morgan('combined',{
    stream: accessLogStream
}));

// static path
app.use(express.static(path.join(__dirname, 'public')));

// multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('file'));

// routes

app.get('/', (req, res) => {
   
    fs.readFile(PATH,'utf8',(err, data)=>{                       
        
       data = data.split('\n');    
       if(err) console.error(err);
       res.render('index',{
           images: data
       });
       
    });

});


app.post('/', (req, res) => {

    const filePath = req.file.path.slice(6);
    const image = new Image(filePath);
    if (!image.addNewEntry()) res.redirect('/');

})

app.use((req, res) => {
    res.status(404).render('error');
});

// listen
console.log(`Server listening at ${PORT}`);
app.listen(PORT);