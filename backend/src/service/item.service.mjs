import Item from '../db/item.model';
import fs from 'fs'
import thumb from 'node-thumbnail';
import {createThumbnail, moveImage, getImageFilename} from './image.service';

async function createItem(item) {
    var item = new Item(item);
    item.creationDate = new Date();
    let images = await Promise.all(item.images.map((image) => {
        if (image.indexOf('tmp/') > -1) {
            return moveImage(image, 'images/');    
        }
        return image;
    }));
    let thumbs = await Promise.all(item.images.map((image) => {
        if (image.indexOf('tmp/') > -1) {
            return createThumbnail('images/' + getImageFilename(image), 'thumbs/');
        }
        return 'thumbs/' + getImageFilename(image)
    }));
    item.images = images;
    item.thumbs = thumbs;
    return item.save();
}

function getItems(params) {
    var query = Item.find();
    if (params.searchTerm) {
        const filter = new RegExp(params.searchTerm, 'i');
        query = query.or({ name: filter });
    }
    if (params.sortField) {
        let sortConfig = {};
        sortConfig[params.sortField] = params.sortOrder || 'asc';
        query = query.sort(sortConfig);
    }
    if (params.skip) query = query.skip(params.skip);
    if (params.limit) query = query.limit(params.limit);

    return query.exec();
}

function getItem(id) {
    return Item.findOne({_id: id});
}

function updateItem(id, item) {
    return Item.findOne({_id: id}).then((doc) => {
         const {_id, ...props} = item;
         doc.set(props);
         return doc.save();   
    });
}

function removeItem(id) {
    return Item.remove({_id: id});
}

export { createItem, getItems, getItem, removeItem, updateItem };