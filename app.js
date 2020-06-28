var express=require("express"), 
    app=express(),
    methodOverride=require("method-override"),
    bodyParser=require("body-parser"),
    expressSantizer=require("express-sanitizer"),
    mongoose=require("mongoose");

//APP Config
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSantizer());


//mongoose.connect("mongodb+srv://sushantbasak:mongo@123@cluster0-g6bk4.mongodb.net/Blogs?retryWrites=true&w=majority");
var connectDB = require("./DB/connections.js");
connectDB();

//Mongoose Config
var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date , default:Date.now}
});

var blog=mongoose.model("blog",blogSchema);

blog.create({
    title: "Test Blog",
    image: "https://media.nature.com/lw800/magazine-assets/d41586-020-01443-0/d41586-020-01443-0_17985512.jpg",
    body: "Dogs"
});

//RESTFUL Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX Routes
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err)
        console.log("Error");
        else{
            res.render("index",{blogs:blogs});
        }
    });
});

//NEW Routes
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE Routes
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,newBlog){
    if(err){
        res.render("new");
    }
    else{
        res.redirect("/blogs");
    }   
   });
});

//SHOW Routes
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });  
 
});

//EDIT Routes
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

//UPDATE Routes

app.put("/blogs/:id",function(req,res){
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+ req.params.id );
        }
    });
});

//DELETE Routes

app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

//SERVER

var PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
    console.log("Server started successfully");
});
