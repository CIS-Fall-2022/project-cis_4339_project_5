const express = require("express");
const router = express.Router();
// Lam
//importing data model schemas
let organization = require("../models/organization"); 

//GET all entries
router.get("/", (req, res, next) => { 
    organization.find( 
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
    organization.find({ org_id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});

//GET entries based on search query
// http://localhost:3000/organizationData/search/?org_id=3&searchBy=id
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { org_name: { $regex: `^${req.query["org_name"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'id') {
        dbQuery = {
            org_id:  req.query["org_id"]
        }
    };
    organization.find( 
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


//POST method
router.post("/", (req, res, next) => { 
    organization.create( 
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

// PUT Method
router.put("/:id", (req, res, next) => {
    organization.findOneAndUpdate(
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

// delete method
router.delete("/id/:id", (req, res, next) => { 
    organization.deleteOne({ org_id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json("Organization tied to the id has been deleted")
        }
    })
});








module.exports = router;