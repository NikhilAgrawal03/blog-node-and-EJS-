const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const path = require("path");
const ejs = require("ejs");
const fs = require('fs');
const multer = require("multer");
const fileUpload = require("express-fileupload");
const multipart = require("connect-multiparty");


const app = express();

app.set('view engine', 'ejs');

app.use(multipart());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));

mongoose.connect("mongodb://localhost:27017/blogpostDB",{useNewUrlParser:true},{ useUnifiedTopology: true });

const blogpostsSchema = {
  title: String,
  description: String,
  content: String,
   username: String,
   image: String,
   createdAt: {
        type: Date,
        default: new Date()
    }
}

const Post =  mongoose.model("Post", blogpostsSchema);

//using multer
// const upload = multer({
//     dest:'./public/postImg',
// })

// app.post("/public", upload.single('image'), (req,res)=>{
//     console.log(req.file);
// })

//rendering different pages
app.get("/", function (req, res) {
    Post.find({}, function(err,posts){
        res.render("index",
        { posts: posts}
     );
    })
})

app.get("/about", function (req, res) {
    res.render("about");
})

app.get("/contact", function (req, res) {
    res.render("contact");
})

app.get("/posts/new", function (req, res) {
    res.render("compose");
})

app.post("/posts/store",function (req, res) {
    

    // const {image} = req.files;
 
    // image.mv(path.resolve(__dirname, 'public/postImg', image.name), (error) => {
    //     Post.create({
    //         username: req.body.username,
    //         title: req.body.postTitle,
    //         description: req.body.postDescription,
    //         image: `/posts/${image.name}`
    //     }, (error, post) => {
    //         res.redirect('/');
    //     });
    // })
        console.log(req.files);
        res.send({
            success: true,
            message: "file uploaded"
        })
        // const post = new Post ({
        //     username: req.body.username,
        //     title: req.body.postTitle,
        //     description: req.body.postDescription,
        //     content: req.body.postContent,
        //     // image: req.file.filename
        //   });
        //   post.save(function(err){
        //     if(!err){
        //       console.log("Post composed and saved to database");
        //       res.redirect("/");
        //     }else{
        //       console.log(err);
        //     }
        //   });   
        })

app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("posts", {
            username: post.username,
            title: post.title,
            description: post.description,
            content: post.content,
            image: post.image,
            createdAt: post.createdAt.toDateString()
        })
    });
})


app.listen(3000, function(){
    console.log("server started at port 3000");
});