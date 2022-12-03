const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
//io is listening to the same port as "app"
const io = require("socket.io")(server);
//const port = process.env.PORT || 8000; 
const itemList = require("./item")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(express.static(path.join(__dirname, "js")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const price = {
  "White Bread":1.85,
  "Eggs":2.25,
  "Milk":1.75,
  "Butter":4.15,
  "Bacon":2.16,
  "Cucumber (1kg)":3.29,
  "Tomatoes (1kg)":3.09,
  "Pork (1kg)":6.99,
  "Fresh Chicken Breast":9.9,
  "Beef":22.95,
};

const qrList = ["FIzOVHpv9DFf9FJ96z","FIstiRsQ6HY7URBnxj","FIenZ7TNbDB2zvTXps","FIWBle8QvYVh3TmlAM","FIYjmHls8xoFyWjXbv","FI4hjBvAr6nj6gQpGh","FItUdmlWFqT1oPdjLp","FIzVXDDOWcPNjh2MQi","FIhmafOXAlBUuqiMwd","FIWACOsAUgGpuyOoTg"]

app.get("/", (req, res) => {
  res.render("index");  
});

// the "items" list is renewed every time a post request is sent while "saved_list" is the one that saves every record
let items = [];
let saved_list = [];
let sum =0;

app.post('/add',(req,res)=>{
  //this array will be emptied every time new item is added
  items = [];
  let code = req.body.code;
  for(let i of itemList){
    if (i["code"] === code){
      let item = i["item"];
      let itemPrice = i["cost"]
      let strItemPrice = String(itemPrice); //convert itemPrice to string
      items.push([item,strItemPrice]);
      saved_list.push([item,itemPrice]);
      sum += itemPrice;
      io.emit("add-item", {
        item : items,
        total : sum
    });
    }
  }
});

app.post("/cancel",(req,res)=>{
  // empty the saved_list
  saved_list = [];
  sum = 0;
  io.emit("clear-item",{
    item : saved_list,
    total : sum
  });
  setTimeout(function(){
    res.redirect("/")
}, 1000);
  //
});

app.post("/delete", (req,res)=>{
  if(saved_list.length >= 0){   
    sum -= saved_list[saved_list.length-1][1];
    saved_list.pop()
    io.emit("update-price",{
      total : sum
    })
  }
});

// previous problem was using "app" instead of "server"
server.listen(8000, function () {  
  console.log('Node server is running on port 8000');  
});  

module.exports = app;
