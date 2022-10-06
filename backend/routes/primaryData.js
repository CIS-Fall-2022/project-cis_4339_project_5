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
            for (const i in data) {
                // count.push(i); // 0,1,2
                // count.push(data[i]["attendees"]);
                for (const x in data[i]["attendees"]) {
                    count.push(x); // 
                  }
              }
            // console.log(data[1]);
            // console.log(data[1]['eventName']);
            console.log("The number of attendees that signed up for an event during the past two months is:", count.length);
            let output = "The number of attendees that signed up for an event during the past two months is:" + (count.length).toString()
            res.json(output);


            
        }
    }
)
});





module.exports = router;