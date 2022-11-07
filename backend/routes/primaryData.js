const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 


//  https://dirask.com/posts/JavaScript-subtract-months-from-date-pVmgGD#:~:text=In%20this%20article%2C%20we%20would%20like%20to%20show,2%29%3B%20%2F%2F%20subtracted%202%20months%20from%20existing%20date
const subtractMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
  };


//GET all entries
router.get("/", (req, res, next) => { 
    primarydata.find( 
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
    primarydata.find( 
        { _id: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET entries based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }
        }
    };
    primarydata.find( 
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

//GET clients off of their number
// http://localhost:3000/primaryData/getnum/8329412894
router.get("/getnum/:nums", (req, res, next) => { 
    let dbQuery = "";
    dbQuery = { phoneNumbers: { "$all" : req.params.nums} } 
    // console.log(req.params.nums)
    // console.log(dbQuery)
    primarydata.find(dbQuery , 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for a single client
router.get("/events/:id", (req, res, next) => { 
    eventdata.find(
    { attendees: req.params.id },
    (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })}
);

//POST
router.post("/", (req, res, next) => { 
    primarydata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                console.log("data added")
                res.json(data); 
            }
        }
    );
    primarydata.createdAt;
    primarydata.updatedAt;
    primarydata.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    primarydata.findOneAndUpdate( 
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
//DELETE for the intake form, which remvoes a client based on the _id 
router.delete("/:id", (req,res,next)=>{
    primarydata.deleteOne(
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


//GET clients off of their number
// http://localhost:3000/primaryData/getnum/8329412894
router.get("/getnum/:nums", (req, res, next) => { 
    let dbQuery = "";
    dbQuery = { phoneNumbers: { "$all" : req.params.nums} } 
    // console.log(req.params.nums)
    // console.log(dbQuery)
    primarydata.find(dbQuery , 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});



// Lam 
// count of cilents who signed up for events past two months
router.get("/search_attendee_2_months/", (req,res,next)=>{

    eventdata.find({
    date: {
        $gte: subtractMonths(new Date(), 2),
        $lte: new Date()
    }}
    ,{eventName:1,attendees:1,date:1},
    (error, data) => { 
        if (error) {
            return next(error);
        } else {
        
            
            // console.log(data);
            // lam test 
            let count = []
            var dict = {}

            // loops through the obj to grab the values within the objects
            // dict drabs the distinct values tied to an event
            // the array act as a counter to count the total num of attendees over all

            for (const i in data) {   
                    // count.push(x)
                for (const [key, value] of Object.entries(data[i]["attendees"])) {
                    // console.log(key, value);
                    if (dict.hasOwnProperty(data[i]["eventName"])) {
                        dict[data[i]["eventName"]].push(value)
                    }
                    else {
                        dict[data[i]["eventName"]] = [value]
                    }
                    count.push(value)
                    }
              }

            console.log(count)
            console.log(dict)
            let test = []
            // loops through my dict object and then grabs the key and values to form the string within the array test  
            for (const [key, value] of Object.entries(dict)) {
            test.push("The number of attendees for the" + key + " is " + (dict[key].length).toString());
            }
            // console.log(test)
            // joins the string and then concatenating that string to another string
            let output_string = (test.join());
            let output = "This report returns the number of attendees who have signed for an event that is taking place between now and two months prior. " + output_string + ". The number of attendees that signed up for an event during the past two months is: " 
            + (count.length).toString()  
            res.json(output);
        }
    }
)
});













module.exports = router;