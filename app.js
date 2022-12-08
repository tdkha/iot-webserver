const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
//io is listening to the same port as "app"
const io = require("socket.io")(server);
const port = process.env.PORT || 8000; 
const itemList = require("./item")

// view engine setup
app.set('views', path.join(__dirname, 'public/static'));
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, "js")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.render("./index.html");  
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
      res.send(item);
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
app.post("/discount",(req,res)=>{
  let percent = req.body.parameter;
  let discountPrice = parseFloat(((saved_list[saved_list.length-1][1])*percent)/100).toFixed(2);
  let afterDiscount = parseFloat(saved_list[saved_list.length-1][1]-discountPrice).toFixed(2);

  if(saved_list.length > 0){   
    saved_list[saved_list.length-1][1] -= discountPrice;
    sum -= discountPrice;
    io.emit("discount-price",{
      total : sum,
      discount : discountPrice,
      after : afterDiscount
    })
  }
});
// previous problem was using "app" instead of "server"
server.listen(port, function () {  
  console.log(`Node server is running on port ${port}`);  
});  

module.exports = app;
