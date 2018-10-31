var methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
express = require("express"),
app = express();
var expressSanitizer = require('express-sanitizer');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTful Routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if(!err) {
            res.render("index", {blogs: blogs});
        } else {
            console.log("err");
        }
    });
});

app.get("/blogs/new", function (req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
       if(!err){
           res.redirect("/blogs");
       } else {
           res.render("new");
       }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if(!err) {
            res.render("show", {blog: blog});
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) { 
        if(!err) { 
            res.render("edit", {blog: foundBlog});
        } else {
            res.redirect("/blogs/:id");
        }
    });
});

app.put("/blogs/:id", function(req, res){
     req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, blog) {
        if(!err) {
            res.redirect("/blogs/" + req.params.id);
        } else {
            res.redirect("/blogs")
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if(!err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Blog is running");
});