const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//collection for OrganizationData
let organizationSchema = new Schema({
    //object ID created for each organizations
    _id: { type: String, default: uuid.v1 },
    //ID number to identify the organziation
    org_id: {
        type: Number,
        require: true,
        unique: true
    },
    //Name of organization
    org_name: {
        type: String,
        require: true
    },
    //Written string description of the organization
    org_description: {
        type: String,
        required: true
    },

}, {

    collection: 'organizationData'

});


const organizationdata = mongoose.model('organizationData', organizationSchema);
module.exports = { organizationdata }
//module.exports = mongoose.model('organization', organizationSchema);
// package the models in an object to export 
