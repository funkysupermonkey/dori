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

fs.readFile(path.resolve(argPath), 'utf8', (err, data) => {
  let items = JSON.parse(data);
  Item.collection.insertMany(items, (err, docs) => {
     if(err) { 
       console.log(err);
       return;
     }
     console.log(`Written ${docs.length} items to DB.`); 
  });
});
