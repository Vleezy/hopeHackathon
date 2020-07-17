// Pulling in modules through require function
const express = require('express');
const app = express();
const data = require("./public/items.json");
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

// Renders the index page with '/' endpoint
app.get('/', function(req, res){
    res.render('index');
});

// Sends the JSON file data with '/api/items' endpoint
app.get('/api/items', function(req, res){
    if(!data) return res.status(404).send(`Couldn't find the list of items.`);
    res.send(data);  
});

// Custom endpoint '/api/items:id' retrieves specific data from single JSON object
app.get('/api/items/:id', function(req,res){
    const item = data.items.find(c => c.id === req.params.id);
    if (!item) return res.status(404).send('No matching results. Please try again.');
    
    res.send(item);
})

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});