const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();

const port = 3000;
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Replace with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://vai:<password>@catsdb.qkckr9j.mongodb.net/catsdb?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connection successful');
    loadData(); // Load data after successful connection
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose schemas
const Schema = mongoose.Schema;

const FactSchema = new Schema({}, { strict: false, collection: 'facts' });
const BreedSchema = new Schema({
  breed: String,
  country: String,
  origin: String,
  coat: String,
  pattern: String,
  image: String // This will be added later
}, { collection: 'breeds' });

// Create models
const Fact = mongoose.model('Fact', FactSchema);
const Breed = mongoose.model('Breed', BreedSchema);

/*// Function to load and insert data into the database
async function loadData() {
  try {
    // Load JSON data from files
    // Replace 'path_to_cat_breeds.json' and 'path_to_cat_facts.json' with the actual paths
    const catBreedsData = JSON.parse(fs.readFileSync('/Users/akkumaha/Desktop/Fiverr/Project-17/cat_breeds.json')).data;
    const catFactsData = JSON.parse(fs.readFileSync('/Users/akkumaha/Desktop/Fiverr/Project-17/cat_facts.json')).data;

    // Add a random image URL to each breed
    catBreedsData.forEach(breed => {
      breed.image = 'https://thecatapi.com/api/images/get?format=src&type=gif';
    });

    // Insert data into MongoDB Atlas
    await Fact.insertMany(catFactsData);
    console.log('Facts inserted');
    await Breed.insertMany(catBreedsData);
    console.log('Breeds with images inserted');
  } catch (err) {
    console.error('Error inserting data:', err);
  }
}*/


// Route to get all breeds
app.get('/breeds', async (req, res) => {
    try {
      const breeds = await Breed.find();
      res.json(breeds);
    } catch (err) {
      res.status(500).send('Error retrieving breeds');
    }
  });
  
  // Route to get breed details by ID
  app.get('/breeds/:breedId', async (req, res) => {
    try {
      const breed = await Breed.findById(req.params.breedId);
      res.json(breed);
    } catch (err) {
      res.status(500).send('Error retrieving breed details');
    }
  });
  
  // Route to get all facts
  app.get('/facts', async (req, res) => {
    try {
      const facts = await Fact.find();
      res.json(facts);
    } catch (err) {
      res.status(500).send('Error retrieving facts');
    }
  });
  
  // Route to get fact details by ID
  app.get('/facts/:factId', async (req, res) => {
    try {
      const fact = await Fact.findById(req.params.factId);
      res.json(fact);
    } catch (err) {
      res.status(500).send('Error retrieving fact details');
    }
  });
  
// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

