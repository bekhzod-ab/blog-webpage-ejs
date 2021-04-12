const mongoose = require("mongoose");

const connectionString = "mongodb+srv://user-1:0802@cluster0.trrfg.mongodb.net/Comments?retryWrites=true&w=majority";

const Schema = mongoose.Schema;
const commentSchema = new Schema ({
    name: {
        required: true,
        type: String   
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    commentDate: {
        type: Date,
        required: true
    }
})

const userSchema = new Schema({
    fName: {
        required: true,
        type: String
    },
    lName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String    
    }
})
// connect commentSchema with the collection from database(MongoDB)
// we will get a module that we can use to interact with database
const User = mongoose.model("Users", userSchema)



const Comment = mongoose.model("Blog", commentSchema);

function connect() {
    return new Promise((resolve,reject) => {
        if(mongoose.connection.readyState === 1) {
            resolve();
        }else {
            mongoose.connect(connectionString, {
                useUnifiedTopology: true,
                useCreateIndex: true,
                useNewUrlParser: true
            }).then(() => {
                resolve()
            }).catch(error => {
                reject(error)
            })
        }
    })
}

function addComment(name, email, comment, commentDate) {
    return new Promise((resolve,reject) => {
        connect().then(() =>{
            const newComment = new Comment({
                name,
                email,
                comment,
                commentDate
            });
            newComment.save().then(result => {
                console.log(result);
                resolve()
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

function getComments() {
    return new Promise((resolve,reject) => {
        connect().then(() => {
            Comment.find().then(comments => {
                resolve(comments);
            }).catch(error => {
                reject(error);
            })
        }).catch(error => {
            reject(error);
        })
    })
}

function registeredUser(fname,lname,email,password) {
    return new Promise((resolve,reject) => {
        connect().then(() => {
            const newUser = new User({
                fName: fname,
                lName: lname,
                email,
                password
            });
            newUser.save().then(() => {
                resolve()
            }).catch((error) => {
                reject(error)
            })
        }).catch((error) => {
            reject(error)
        })
    })
}

module.exports = {
    addComment,
    getComments,
    registeredUser
}