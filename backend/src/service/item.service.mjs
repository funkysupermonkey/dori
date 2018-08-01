import Item from '../db/item.model';

function createItem(item) {
    var item = new Item(item);
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

export { createItem, getItems };