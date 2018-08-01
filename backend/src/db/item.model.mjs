import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
    name: String,
    size: String,
    amount: Number,
    image: String,
    donor: String,
    rental: Boolean
});

const Item = mongoose.model('Item', itemSchema);

export default Item;


