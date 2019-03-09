const PORT = 5000;

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const Image = require('./model/Images');

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views');

// use body-parser 
app.use(bodyParser.urlencoded({
    extended:false
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

app.get('/', (req, res ) => {
    const image = new Image();
    let data = image.readAllEntry();
    if(!data) data = null;
    res.render('index',{
        imageData: data
    });
});


app.post('/', (req, res ) => {
    
    const fileType = req.file.mimetype;
    const filePath  = req.file.path.slice(6);
    const fileName = req.body.fileName;    

    const image = new Image( fileName, filePath, fileType);    
    if(!image.addNewEntry()) res.redirect('/');    

})

app.use((req, res ) => {
    res.status(404).render('error');
});

// listen
console.log(`Server listening at ${PORT}`);
app.listen(PORT);
