const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Server is READY!");
})


app.listen(port, () => {
    console.log("Listening on port ", port)
})


const uri = "mongodb+srv://todo:UvWOevoqz0sSfQUO@cluster0.t8s5g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// iqawFLvSMXmTYvrE
async function run() {
    try {
        await client.connect();
        const noteCollection = client.db('todo-app').collection('notes');

        app.post('/notes', async (req, res) => {
            const notes = req.body;
            const result = await noteCollection.insertOne(notes);
            res.send(result);
        })

        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = noteCollection.find(query);
            const notes = await cursor.toArray();
            res.send(notes);
        })

        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await noteCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/updateDecoration/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    textDecoration: updateInfo.textDecoration,
                }
            }
            const result = await noteCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);
