import express from 'express';
import mongoose from 'mongoose';
import {createItem, getItems, getItem, removeItem, updateItem} from './service/item.service';
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swagger.json';
import fileUpload from 'express-fileupload';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {Strategy} from 'passport-openidconnect';

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('We are connected!');
});


var router = express.Router();
var app = express();

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(fileUpload());

router.route('/items').post((req, res) => {
    createItem(req.body).then((item) => {
        res.json(item);
    }).catch((reason) => {
        console.log(reason);
        res.status(500).send(reason.message);
    });
}).get((req, res) => {
    getItems(req.query).then((items) => {
        res.json(items);
    }).catch((reason) => {
        res.status(500).send(reason.message);
    });
});

router.route('/items/:id').get((req, res) => {
    getItem(req.params.id).then((item) => {
        res.json(item);
    }).catch(reason => res.status(500).send(reason.message));
}).delete((req, res) => {
    removeItem(req.params.id).then(() => {
        res.status(204).end();
    }).catch(reason => res.status(500).send(reason.message));
}).put((req, res) => {
    updateItem(req.params.id, req.body).then((item) => {
        res.json(item);
    }).catch(reason => res.status(500).send(reason.message));
});

router.route('/upload').post((req, res) => {
    let file = req.files.file;
    let filepath = `tmp/${file.name}`;
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    if(!/image\/(png|jpg|jpeg|gif)/.test(file.mimetype))
        return res.status(400).send('Please upload an image.');
        file.mv(path.resolve(filepath), function(err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.send(filepath);
      });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use('/api/v1', router);
app.use('/tmp', express.static('tmp'));
app.use('/images', express.static('images'));
app.use('/thumbs', express.static('thumbs'));

app.listen(4000);