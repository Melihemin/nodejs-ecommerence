const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ArsaSchema = new mongoose.Schema({
    
    title: {type: String, required:true},
    content: {type: String, required:true},
    date: {type: Date, default: Date.now},
    category: {type: Schema.Types.ObjectId, ref:'categories'},
    m2: {type: String, required:true},
    m2fiyati: {type: String, required:true},
    imardurumu: {type: String, required:true},
    adano: {type: String, required:true},
    parselno: {type: String, required:true},
    paftano: {type: String, required:true},
    kaks: {type: String, required:true},
    gabari: {type: String, required:true},
    tapudurumu: {type: String, required:true},
    katkarsilik: {type: String, required:true},
    krediuygunluk: {type: String, required:true},
    takas: {type: String, required:true},
    adres: {type: String, required:true},
    post_image: {type: String, required:true},
    cash: { type: String, required: true },
});

module.exports = mongoose.model('Arsa', ArsaSchema);