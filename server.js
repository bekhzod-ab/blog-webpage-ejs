const express = require("express");
const app = express();
const port = process.env.PORT || 3500;
const db = require("./models/db")

app.use(express.static(__dirname + "/Public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


//  GET requests

app.get("/", (req,res) => {
    res.render("index")
})

app.get("/blog", (req,res) => {
    db.getComments().then(comments => {
        res.render("blog", {comments})
    }).catch(error => {
        res.render("blog", {comments: []})
    })
})

app.get("/about", (req,res) => {
   
    res.render("about")
})

app.get("/contact", (req,res) => {
    res.render("contact")
})

app.get("/marketing", (req,res) => {
    res.render("marketing")
})

app.get("/login", (req,res) => {
    res.render("login")
})

app.get("/register", (req,res) => {
    res.render("register")
})


// POST requests

app.post("/register", (req,res) => {
    console.log(req.body)
    db.registeredUser(req.body.fName, req.body.lName, req.body.email, req.body.password).then(() => {
        res.send("you are registered")
    }).catch((error) => {
        if (error.code === 11000) {
            res.send("this email is already registered")
        }else {
            res.send(error.message)
        }
    })
    
})

app.post("/blog", (req,res) => {
    console.log(req.body)
    // res.render("blog")
    db.addComment(req.body.name, req.body.email, req.body.comment, Date.now()).then(() => {

        db.getComments().then(comments => {
            res.render("blog", {comments})
        }).catch(error => {
            res.render("blog", {comments: []})
        });
        
    }).catch(error => {
        res.send("Your comment can't be saved" + error.message)
    })
})


app.listen(port, () => {
    console.log(`Using Port #${port}`)
})