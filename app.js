var bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    app         = express();

//app config    
mongoose.connect("mongodb://localhost/restful_blog");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
})