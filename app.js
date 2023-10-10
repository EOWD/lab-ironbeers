const express = require('express');

const hbs = require('hbs');
const async = require('hbs/lib/async');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/beers', async (req, res) => {
  try {
    const beersFromApi = await punkAPI.getBeers();
    res.render('beers', { beer: beersFromApi });
    // console.log('Beers from API:', beersFromApi);
  } catch (error) {
    console.log(error);
  }

  /* punkAPI
    .getBeers()
    .then(beersFromApi => {
      console.log('Beers from API:', beersFromApi);
      res.render('beers', { beer: beersFromApi });
    })
    .catch(error => console.log(error));*/
});
app.get('/random-beer', async (req, res) => {
  try {
    const response = await punkAPI.getRandom();
    res.render('random-beer', response[0]);
  } catch (error) {
    console.log(error);
  }
});

app.get('/beers/:beerId', async (req, res) => {
  try {
    const beerId = req.params.beerId;

    const beer = await punkAPI.getBeer(beerId);

    res.render('beerdetail', beer[0]);
  } catch (error) {
    console.error('Error fetching and rendering beer details:', error);
  }
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
