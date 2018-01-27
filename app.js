var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();

//app config    
mongoose.connect("mongodb://localhost/restful_blog");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//mongoose model congif
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now},
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image : "https://images.unsplash.com/photo-1501820488136-72669149e0d4?auto=format&fit=crop&w=1050&q=80",
//     body: "This is a blogpost!!! My first infact!"
// });

//restful routes
app.get("/",function(req,res){
  res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs: blogs});     
        }
    });
});

//new route
app.get("/blogs/new", function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
     if(err){
         res.render("new");
     }else{
         res.redirect("/blogs");
     }   
    });
});

app.get("/blogs/:id",function(req,res){
      Blog.findById(req.params.id, function(err, foundBlog){
          if(err){
              res.redirect("/blogs");
          }
          else{
              res.render("show", {blog:foundBlog});
          }
      });
});

// app.get("/blogs/:id/edit", function(req,res){
//     Blog.findById(req.params.id, function(err,foundBlog){
//         if(err){
//             res.redirect("/blogs");
//         }else{
//             res.render("edit", {blog: foundBlog});
//         }
//     });
// });

app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
         res.render("edit",{blog: foundBlog});   
        }
    });
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })   
});

app.delete("/blogs/:id/",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
})