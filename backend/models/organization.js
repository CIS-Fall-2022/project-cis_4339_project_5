const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//collection for eventData
let organizationSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    org_id: {
        type: Number,
        require: true,
        unique: true
    },
    org_name: {
        type: String,
        require: true
    },
    org_description: {
        type: String,
        required: true
    },

}, {

    collection: 'organization'

});

module.exports = mongoose.model('organization', organizationSchema);
// package the models in an object to export 
