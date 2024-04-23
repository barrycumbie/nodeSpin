require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
const port = (process.env.PORT || 5500)
const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = process.env.MONGO_URI; 
const uri = "mongodb+srv://barry:cat@snowcatcluster.uhucqcw.mongodb.net/?retryWrites=true&w=majority&appName=snowcatCluster";


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function getStatuses() {
    try {
        await client.connect();
        const result = await client.db("barry-data-bucket").collection("randomThings").find().toArray();
        return result;
    } catch (err) {
        console.log("getStatuses() error:", err);
    } finally {
        await client.close();
    }
}

app.get('/', async (req, res) => {
  
    const result = await getStatuses();
    
    res.render('index', {
        pageTitle: "status thing",
        statusData: result
    });

    // res.render('index', { pageTitle: 'status thing'})
// res.sendFile('index.html'); 
})

  
app.post('/addStatus', async (req, res) => {
console.log('req.body');
    try {
    await client.connect();
    const collection = client.db("barry-data-bucket").collection("randomThings");
    console.log(req.body);
    await collection.insertOne({ post: req.body.statusTime});
    res.redirect('/');
} catch (err) {
    console.log(err)
}
});
    


app.listen(port, () => console.log(`Server is running...on ${ port }` ));