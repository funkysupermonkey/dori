import express from 'express';
import mongoose from 'mongoose';
import {createItem, getItems} from './service/item.service';
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swagger.json';

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
app.use(bodyParser.json());

router.route('/items').post((req, res) => {
    createItem(req.body).then(res.json).catch((reason) => {
        res.status(500).send(reason);
    });
}).get((req, res) => {
    getItems(req.query).then((items) => {
        res.json(items);
    }).catch((reason) => {
        res.status(500).send(reason);
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use('/api/v1', router);

app.listen(4000);