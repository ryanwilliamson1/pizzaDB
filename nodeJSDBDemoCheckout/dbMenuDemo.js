
var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "static/";
var MongoClient = require('mongodb').MongoClient;
var db,menu;
var dbURL="mongodb://pizza1:pizza1@localhost:27017/pizzadb"
var server=http.createServer(function (req, res) {
   var urlObj = url.parse(req.url, true, false);
  console.log(urlObj.pathname)
  if(req.method=="GET")
  	if(urlObj.pathname=="/menu"){
      var query={}
      findMenuItems(res,query)
  	}
  else{ 
  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
  if (err) {
    res.writeHead(404);
    res.end("<h1>Page does not exist!</h1>");
    return;
  }
  res.writeHead(200);
  res.end(data);
})
}
if(req.method=="POST")
{
  //placeOrder request
  if(urlObj.pathname=="/placeOrder"){
    var dataFromClient=''
    //on event "data coming in"
    req.on('data',function(chunk) {
      dataFromClient+=chunk
    })
    req.on('end', function() {
      insertOrders(dataFromClient,res)
      res.writeHead(200);
      res.end("Thank you for Order!")
    })
    }
  }
})
// Initialize connection once
MongoClient.connect(dbURL, 
					function(err, database) {
  if(err) throw err;

  db=database.db("pizzadb")
  
  // Start the application after the database connection is ready
  server.listen(8000);
  console.log("Listening on port 8000");
});

function findMenuItems(res,query)
{
  console.log(query)
  db.collection("menu").find(query).toArray(function (err,results) {
 
    console.log(results)
    
    res.writeHead(200);
    res.end(JSON.stringify(results))
  })

  //    res.writeHead(200);
  // res.end(results);
 
}

//function insertOrders(data,res)
function insertOrders(data,res) {
{
  console.log(data)
  var info=JSON.parse(data)
  var cart=info[0]
  var customerInfo=info[1]
  var currentDate = new Date()
  var records=[]

  for(i in cart)
  {
    item=cart[i]
    tPrice=item.price*item.quantity
    var record = {customerID:customerInfo[0].customerID,
                  pizzaName:item.pizzaName,
                  price:tPrice,
                  quantity:item.quantity,
                  date:currentDate
                }
    records.push(record)
    console.log(record)
  }
  db.collection("orders").insertMany(records,function(err,result){
    if(err)
      console.log(err)
    else
    {
      console.log("insert: "+result.insertedCount)
      res.writeHead(200);
      res.end("Your order has been placed")
    }
  })
}
}