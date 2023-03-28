const express = require('express');
const redis = require('redis');
const axios = require('axios');

const redisURL = "redis://127.0.0.1:6379"
const client = redis.createClient({
    url: redisURL,
});

async function connecToRedis(){
    client.connect()
    .then(() => {
        console.log("Connected to Redis");
    })
}



const app = express()
app.use(express.json());


app.post("/", async (req, res) => {
    const { key, value } = req.body;
    console.log(key, value)
    const resp = await client.set(key, value);
    return res.json(resp);
});

app.get("/", async (req, res) => {
    const val = await client.get(req.body.key)
    return res.json(val);
})


app.get("/posts/:id", async (req, res) => {
    
    const cachedPost = await client.get(`post-${req.params.id}`);
    if(cachedPost){
        return res.json(JSON.parse(cachedPost));
    }
    
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`)
    client.set(`post-${req.params.id}`, JSON.stringify(response.data), {
        EX: 10,
    });
    
    return res.json(response.data);

});


connecToRedis()
    .then(() => {
        app.listen(8080);
        console.log("Listening on port 8080");
    });
