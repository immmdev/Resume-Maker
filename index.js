const express=require("express");
const app=express(); // express pakage ready to use
const path=require("path");


const port=3000;

app.listen(port,(req,res)=>{
    console.log("app is listening at 3000");
}); //server is ready to take req and generate responses
 

//clear

app.set("view engine","ejs");
    
app.set("views",path.join(__dirname,"/views")); //accessing views from anydir

app.use(express.static(path.join(__dirname,"public")));// combining static file like css to the template


app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/res",(req,res)=>{
    res.render("res.ejs")
});





