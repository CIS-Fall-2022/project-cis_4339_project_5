const express = require("express");
const router = express.Router();
// Lam
//importing data model schemas
let { eventdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST new event
router.post("/", (req, res, next) => { 
    eventdata.create( 
        req.body, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT update event information by id 
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//Lauren 
//DELETE endpoint for an event
router.delete("/:id", (req,res,next)=>{
    eventdata.deleteOne(
        {_id:req.params.id}, 
        (error,data)=>{
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});



//PUT add attendee to event using client ID

router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed uo
    eventdata.find( 
        {event_id: req.params.id, attendees: req.body.client_id }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { event_id: req.params.id }, 
                        { $push: { attendees: req.body.client_id } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.send('Client is added to event.');
                                console.log('Event successfully updated!', data)
                            }
                        }
                    );
                }

            }
        }
    );

});

//Lauren
//GET for event history for past 2 months with the list of attendees
router.get("/search_2_months/", (req,res,next)=>{
    let dbQuery = {$and:[{date:{$lt:new Date()}},{date:{$gt:'2022-08-03'}}]};
    eventdata.find(
        dbQuery,{eventName:1,attendees:1},
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    )
});

module.exports = router;