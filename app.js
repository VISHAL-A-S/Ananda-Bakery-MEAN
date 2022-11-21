const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname)); //to avoid sending static files using res.send file

mongoose.connect("mongodb+srv://VISHAL_A_S:pass123@netcentric.cdrsajw.mongodb.net/DataCollection")

app.get("/",function(req,res){           
    res.sendFile(__dirname + '/index.html')
})
const UserSchema = { 
    name:String,
    email:String,
    phone:String,
    pass:String,
    cpass:String,
}
const newUser=mongoose.model("users",UserSchema)

app.post("/signUpForm",function(req,res){
    let insert =new newUser({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        pass:req.body.pass,
        cpass:req.body.cpass,
    })
    newUser.findOne({email:req.body.email}, (err, data) => {
        if (data!=null) 
        {
            res.send("<script>alert('Already Registered!'); window.location.href = '/login.html'; </script>");
        }
        else 
        {
            insert.save();
            res.redirect("/login.html")
        }
    })
})
app.post("/loginForm", (req,res) => {
    newUser.findOne({email:req.body.email,pass: req.body.pass},(err,data) =>{
      if(data!=null)
      {
        if(data.email=="admin@gmail.com")
      {
        res.redirect("/admin.html");
      }
      else{
        res.redirect("/index.html");
      }
      }
      else
      {
        res.send("<script>alert('Invalid credentials'); window.location.href = '/login.html'; </script>");
      }
    });
  
  });
const SnackSchema = { 
    snackName:String,
    measurement:String,
    price:String,
    imgUrl:String,
    aboutSnack:String,
}
const newSnack=mongoose.model("snacks",SnackSchema)
app.get("/snackForm",(req,res)=>{
    newSnack.find( (err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        else{
            return res.status(200).send(data)
        }
    })
})

app.post("/snackForm",function(req,res){
    newSnack.findOne({snackName:req.body.snackName,measurement: req.body.measurement},(err,data) =>{
        if(data!=null)
        {   query = {
            snackName:req.body.snackName,
            measurement:req.body.measurement,   
        }
        update = {
            price:req.body.price,
                imgUrl:req.body.imgUrl,
                aboutSnack:req.body.aboutSnack,
        }
            newSnack.updateOne(query,update, function (err, result) {
                if (err)
                {
                    console.log(err)
                }
                else
                {
                    res.redirect("/admin.html");
            }
            });
        }
        else
        {
            let insert =new newSnack({
                snackName:req.body.snackName,
                measurement:req.body.measurement,
                price:req.body.price,
                imgUrl:req.body.imgUrl,
                aboutSnack:req.body.aboutSnack,
            })
            insert.save();
                res.redirect("/admin.html");
        }
      });
    
})

const CartSchema = { 
    snackName:String,
    measurement:String,
    price:String,
    count:String,
}
const newCart=mongoose.model("carts",CartSchema)
app.get("/cartForm",(req,res)=>{
    newCart.find( (err,data)=>{
        if(err){
            return res.status(500).send(err)
        }
        else{
            cart_check=data;
            return res.status(200).send(data)
        }
    })
})
app.post("/cartForm",function(req,res){
    let insert =new newCart({
        snackName:req.body.snackName,
        measurement:req.body.measurement,
        price:req.body.price,
        count:req.body.count,
    })
    insert.save();
        res.redirect("/snack.html");
})

// app.post("/cartdel",(req,res)=>{
//     var MongoClient = require("mongodb").MongoClient;
//     var url =
//       "mongodb+srv://VISHAL_A_S:pass123@netcentric.cdrsajw.mongodb.net/DataCollection";
  
//     MongoClient.connect(url, function (err, db) {
//       if (err) throw err;
//       var dbo = db.db("DataCollection");
//       dbo.dropCollection("carts", function (err, delOK) {
//         if(cart_check.length!=0)
//         {
//           if (delOK) {
//             res.redirect("/index.html");
//           } else {
//             res.redirect("/payment.html");
//           }
  
//         }
//         else{
//           res.redirect("/payment.html");
//         }
        
//       });
//     });
//   });
  
const PaymentSchema = { 
    cardNumber:String,
    cardHolderName:String,
    expirationMonth:String,
    expirationYear:String,
    cvv:String,
}
const newPay=mongoose.model("payments",PaymentSchema)

app.post("/paymentForm",function(req,res){
    let insert =new newPay({
        cardNumber:req.body.cardNumber,
        cardHolderName:req.body.cardHolderName,
        expirationMonth:req.body.expirationMonth,
        expirationYear:req.body.expirationYear,
        cvv:req.body.cvv,
    })
    insert.save();
    var MongoClient = require("mongodb").MongoClient;
    var url =
      "mongodb+srv://VISHAL_A_S:pass123@netcentric.cdrsajw.mongodb.net/DataCollection";
  
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("DataCollection");
      dbo.dropCollection("carts", function (err, delOK) {});});
        res.redirect("/index.html");
})
app.listen(3000,function(){
    console.log("server is running on 3000")
})


