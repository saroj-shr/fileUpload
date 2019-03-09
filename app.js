const PORT = 5000;

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

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

// multer optins
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

app.get('/', (req, res, next) => {
    res.render('index');
});

app.use((req, res, next) => {
    res.status(404).render('error');
});

app.listen(PORT);
