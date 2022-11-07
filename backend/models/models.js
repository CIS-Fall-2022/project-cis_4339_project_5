const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//collection for intakeData for clients includes the embedded address object schema
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    org_id:{
        type: Number,
        required: true
    },
   
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String
    },
    phoneNumbers: {
        primaryPhone: {
            type: Number,
            required: true,
            unique: true

        },
        seondaryPhone: 
        {
            type: Number,
            unique: true
          
        }
    },
    address: {
        line1: {
            type: String,
            required: true
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
            required: true
        },
        zip: {
            type: Number,
            required: true
        }
}
}, {
    collection: 'primaryData',
    timestamps: true
});



//collection for eventData includes embedded address object schema
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    event_id: {
        type: Number,
        require: true,
        unique: true

    },

    eventName: {
        type: String,
        required: true
    },
    services: [{
        type: String,
        required: true
    }],
    date: {
        type: Date,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: Number,
        }
    },
    description: {
        type: String,
    },
    // acts as the list of attendees 
    attendees: [{
        type: Number
    }]
}, {
    collection: 'eventData'
});







// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
// const clientaddress = mongoose.model('cilentaddress',cilentaddressSchema)
// package the models in an object to export 
module.exports = { primarydata, eventdata }
