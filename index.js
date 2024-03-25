const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

const multer = require('multer');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static (path.join(__dirname, "public")));


// Set up the storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });




let posts = [
    {
        id: uuidv4(),
        username: "Sid",
        content : "I am a developer"
    },
    {
        id: uuidv4(),
        username: "Shasha",
        content : "I love coding"
    },
    {
        id: uuidv4(),
        username: "Aditya",
        content : "I love hacking"
    },
];


// Serve HTML form for file upload and image display
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.ejs'));
  });
  

// Handle file upload and display
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    console.log(req.file); 
    res.send("Uploaded Successfully");
   
  });
// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));
  


app.get("/posts", (req,res) => {
    res.render("index.ejs", {posts});
});
app.get("/posts/new", (req,res) => {
    res.render("new.ejs");
});
app.post("/posts", (req,res) => {
    let {username, content} = req.body;
    let id = uuidv4();
    posts.push({id, username, content});
    res.redirect("/posts");
});
app.get("/posts/:id", (req,res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id );
    res.render("show.ejs", {post});
});
//UPDATE OPERATION
app.patch("/posts/:id", (req,res) => {
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id );
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});
app.get("/posts/:id/edit", (req,res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id );
    res.render("edit.ejs", {post});
});
//DELETE OPERATION
app.delete("/posts/:id", (req,res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id );
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
});