const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Movie = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();
const cors = require('cors')

// this is our MongoDB database
const dbRoute = "mongodb+srv://user:mongo@clustermongo-vjjwv.mongodb.net/test?retryWrites=true";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors())

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Movie.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Movie.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData",(req,res)=> {
  const id = req.body;
  Movie.findOneAndDelete(id, err => {
   if (err){ return res.send(err);}
   return res.json({ success: true });
  }); 
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Movie();
  const { title, description } = req.body;
  data.description = description;
  data.title = title;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => {console.log(`LISTENING ON PORT ${API_PORT}`);});