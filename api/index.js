const express = require("express")
const fs = require("fs")
const bodyParser = require("body-parser")

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send(fs.readFileSync("../index.html", 'utf8'))
})

app.get("/api/todos", (req, res) => {
    fs.readFile("../todos.json", 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: "Could not read todos.json" })
        } else {
            res.json(JSON.parse(data))
        }
    })
})

app.post("/api/todos", (req, res) => {
    fs.readFile("../todos.json", 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: "Could not read todos.json" })
        } else {
            const todos = JSON.parse(data)
            const newTodo = {
                id: todos.length + 1,
                title: req.body.title,
                completed: false
            }
            todos.push(newTodo)
            fs.writeFile("../todos.json", JSON.stringify(todos), (err) => {
                if (err) {
                    res.status(500).send({ error: "Could not write to todos.json" })
                } else {
                    res.json(newTodo)
                }
            })
        }
    })
})

app.delete("/api/todos/:id", (req, res) => {
    fs.readFile("../todos.json", 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: "Could not read todos.json" })
        } else {
            let todos = JSON.parse(data)
            todos = todos.filter(todo => todo.id !== parseInt(req.params.id))
            fs.writeFile("../todos.json", JSON.stringify(todos), (err) => {
                if (err) {
                    res.status(500).send({ error: "Could not write to todos.json" })
                } else {
                    res.sendStatus(204)
                }
            })
        }
    })
})

app.listen(3333, () => console.log('App running on port 3333'))

module.exports = app
