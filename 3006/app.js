
//Install Packages
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const expressValidator = require('express-validator');



//Defines the packages
const app=express();
app.use(bodyParser.urlencoded({extended: true}));

// sets view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));


//handle session
app.use(session({
    secret:"Login System.",
    resave:false,
    saveUninitialized:false
  }));
  app.use(flash());


  //passport - passport is used for hashing etc
  app.use(passport.initialize());
  app.use(passport.session());
  

//Database connection
 mongoose.connect("mongodb://localhost:27017/chatDB",{useNewUrlParser:true,useUnifiedTopology: true});
 mongoose.set("useCreateIndex",true);

 //database schema
const userSchema=new mongoose.Schema({
  email:String,
  username:String,
  password:String,
  firstName:String,
  lastName:String
});
userSchema.plugin(passportLocalMongoose);


//database model
const User=mongoose.model("User",userSchema);


 //database schema
const moneySchema=new mongoose.Schema({
  money:{type:Number},
  date:{type:Date},
  //this for connect with user schema
  owner:{type:Schema.Types.ObjectId, ref:'User'}
});
//database model
const Money=mongoose.model("Money",moneySchema); 


 //database schema
const calSchema=new mongoose.Schema({
  cal:{type:Number},
  date:{type:Date},
  //this for connect with user schema
  owner:{type:Schema.Types.ObjectId, ref:'User'}
});
//database model
const Cal=mongoose.model("Cal",calSchema); 

//define the passport to decrypt password
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 

//validator for check the data and inputs
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
  var namespace=param.split('.'),
  root=namespace.shift(),
  formParam=root;

while (namespace.length) {
  formParam +='['+namespace.shift()+']';
}
return{
  param:formParam,
  msg:msg,
  value:value
};
  }
}));

//define the flash to display the messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//fetch all users  
app.get('*',function(req,res,next){
  res.locals.user=req.user||null;
  next();
});



//this method for the index page and if unathorize cant show it
app.get("/",function(req,res){
    if (req.isAuthenticated()) {
        res.render("index");
    }else {
    res.redirect("/login");
    }
});


//register methods
app.get("/register",function(req,res){
    res.render("register",{errormsgs:{}});
  });
  
  //this for add new user
  app.post("/register",function(req,res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const username=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.cpassword;
  
  
  //form validator
    req.checkBody('fname','First Name field is required').notEmpty();
    req.checkBody('lname','Last Name field is required').notEmpty();
    req.checkBody('name','username field is required').notEmpty();
    req.checkBody('email','email field is required').notEmpty();
    req.checkBody('email','email field is not valid').isEmail();
    req.checkBody('password','password field is required').notEmpty();
    req.checkBody('cpassword','password is not match').equals(req.body.password);
  
  //Check errors
  const errors=req.validationErrors();
  
    if (errors) {
    res.render("register",{errormsgs:errors,titlemsg:"Register"});
    }else {  
     User.register({username:req.body.name,email:req.body.email,firstName,lastName},password,function(err,user){
       if (err) {
         console.log(err);
         res.redirect("/register");
       }else {
       //  passport.authenticate("local")(req,res,function(){
               res.redirect("/login");
             //});
       }
     });
       req.flash('success','You Are Now Registered and You Can login');
    }
  });
  
  
  //login methods
  app.get("/login",function(req,res){
    res.render("login");
  });
  
  //this part for check the data from form 
  app.post("/login",function(req,res){
  const user=new User({
    username:req.body.username,
    password:req.body.password
  });
  
    req.login(user,function(err){
      if (err) {
        console.log(err);
    res.redirect("/login");
  
      }else {
  
        passport.authenticate("local",{failureRedirect:'/login' })(req,res,function(){
  req.flash('success','You Are now logged in');
  
          res.redirect("/");
  
        });
  req.flash('failure','invalid username or password');
  req.flash('failure','unAuthorized');
      }
    });
  });
  

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  //this method for logout 
  app.get("/logout",function(req,res){
  req.logout();
  req.flash('success','You are logged out');
  res.redirect("/login");
  });


  
  //this part for the chart
  app.get('/chart',(req,res)=>{
    //fetch all data from money and calories data
       Money.find({owner: req.user._id}).populate("owner", "_id money date").exec((err,moneyFound)=>{
         Cal.find({owner: req.user._id}).populate("owner", "_id cal date").exec((err,foundCal)=>{
     

       //create two arraies for save the data
      const arr=[];
      const date=[];


          //make for loop to loop the object of model
      for (let i = 0; i < moneyFound.length; i++) {
        arr.push(moneyFound[i].money);
        date.push(moneyFound[i].date.toString().substring(4,15));
      }


        //create two arraies for save the data
      const calarr=[];
      const calldate=[];

      
      //make for loop to loop the object of model
      for (let i = 0; i < foundCal.length; i++) {
        calarr.push(foundCal[i].cal);
        calldate.push(foundCal[i].date.toString().substring(4,15));
      }
        //this part for send the data for the html file
      res.render("charts", {data:{moneyFound: [arr], date:[date],foundCal: [calarr], datecal:[calldate]}});

       });
      });
  })

  //this part for money chart and add new data
  app.post('/chart',(req,res)=>{
    const today= new Date();
    const addmoney=new Money();
    addmoney.owner=req.user._id;
    addmoney.date=today;
    addmoney.money =parseInt(req.body.money);
    addmoney.save((err)=>{
      if(err){
        console.log(err);
      }
      res.redirect('/chart');
    });
  });
  
  //this part for calories chart and add new data
  app.post('/calChart',(req,res)=>{
    const today= new Date();
    const addCal=new Cal();
    addCal.owner=req.user._id;
    addCal.date=today;
    addCal.cal=parseInt(req.body.cal);
    addCal.save((err)=>{
      if(err){
        console.log(err);
      }
      res.redirect('/chart');
    });
  });


//render the chat page
  app.get('/chat',(req,res)=>{
    res.render('chat');
  });
  //render the chatroom page
  app.get('/chatroom',(req,res)=>{
    res.render('chatroom');
  });

  //this is the server which runs on port 3000
  app.listen(process.env.PORT||3000,function(){
    console.log("server runs on port 3000");

  });