// getting-started.js
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Item from './item.model';

mongoose.connect('mongodb://localhost/test');

const argPath = process.argv[2];

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('We are connected!');
});

var query = Item.find()
query = query.or({name: /bär/i})
query.exec((err, items) => {
    console.log(items);
});