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
//iteration3, step1
//homepage
app.get('/', (req, res)=> {
  res.render('index');
//console.log('Website is launching .. 👾');
})

//iteration3, step 2 
//artist search page
  app.get('/artist-search', (req, res)=> {
    spotifyApi
    .searchArtists(req.query.q)
    .then(data => {
      console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results',data.body.artists);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  })

  //iteration 4
  //albums
  app.get('/albums/:artistId', (req, res, next) => {
    const {artistId} = req.params;
    //console.log(req.params);
    spotifyApi
    .getArtistAlbums(artistId)
    .then(data =>{
      res.render('albums', {albums:data.body.items});
    })
    .catch(err=> console.log('The error occurred while searching the artists album', err));    
  });
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
