
const express = require('express');
var path = require('path');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const price = {
  "White Bread":1.85,
  "Eggs":2.25,
  "Milk":1.75,
  "Butter":4.15,
  "Cabbage":1.55,
  "Bacon":2.16,
  "Cucumber (1kg)":3.29,
  "Tomatoes (1kg)":3.09,
  "Pork (1kg)":6.99,
  "Fresh Chicken Breast":9.9,
  "Beef":22.95,

}

app.get('/', (req, res) => {
  res.render('index',{
    item : items,
    total : sum
  })
});


const items = [];
let sum =0;
app.post('/',(req,res)=>{
  let item = req.body.item;
  if(price.hasOwnProperty(item)){
    let itemPrice = price[item]
    let strItemPrice = String(itemPrice)+"<br/>"
    //add a line break 
    item = item +"<br/>";
    items.push([item,strItemPrice]);
    sum += itemPrice;
  }
  console.log(items)
  res.redirect('/')
});

app.listen(8000, function () {  
  console.log('Node server is running on port 8000');  
});  
module.exports = app;
