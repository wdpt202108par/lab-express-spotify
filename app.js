require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

//Creation of a route for the homepage
app.get('/home', (req, res, next) => {
  res.render('home');
});

app.get('/artist-search', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.q)/*'HERE GOES THE QUERY ARTIST'*/
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results', { artists : data.body.artists.items});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

//Iteration 4 : View Albums
app.get('/albums/:id', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(
    function(data) {
      console.log('Album information', data.body);
      res.render('albums', { albums : data.body.items});
    },
    function(err) {
      console.error(err);
    }
  );
})

//Iteration 5 : View Tracks


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
