import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
    name: String,
    size: String,
    amount: Number,
    images: [String],
    donor: String,
    rental: Boolean,
    creationDate: Date
});

const Item = mongoose.model('Item', itemSchema);

export default Item;


