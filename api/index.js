const express = require("express")
const fs = require("fs")
const path = require("path")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))

app.get("/", (req, res) => {
    res.type("text/html")
    res.send(fs.readFileSync("index.html", 'utf8'))
})

app.get("/addPost", (req, res) => {
    res.type("text/html")
    res.send(fs.readFileSync("addPost.html", 'utf8'))
})

app.get("/api/posts", (req, res) => {
    fs.readFile("posts.json", 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: "Could not read todos.json" })
        } else {
            res.json(JSON.parse(data))
        }
    })
})

app.post("/api/posts", (req, res) => {
    fs.readFile("posts.json", 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: "Could not read todos.json" })
        } else {
            let posts = JSON.parse(data)
            const newPost = {
                id: posts.length + 1,
                title: req.body.title,
                body: req.body.content
            }
            posts.push(newPost)
            posts = [...new Set(posts)]
            fs.writeFile("posts.json", JSON.stringify(posts), (err) => {
                if (err) {
                    res.status(500).send({ error: "Could not write to todos.json" })
                } else {
                    res.type("json")
                    res.json(newPost)
                }
            })
        }
    })
})

app.delete("/api/posts/:id", (req, res) => {
    fs.readFile("posts.json", 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: "Could not read posts.json" })
        } else {
            let posts = JSON.parse(data)
            posts = posts.filter(post => post.id !== parseInt(req.params.id))
            fs.writeFile("posts.json", JSON.stringify(posts), (err) => {
                if (err) {
                    res.status(500).send({ error: "Could not write to todos.json" })
                } else {
                    res.sendStatus(204)
                }
            })
        }
    })
})

let port = 3018

app.listen(port, () => {
    console.log('App running on port ' + port)
})

module.exports = app
