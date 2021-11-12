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
app.get('/', (req, res, next) => {
  res.render('homepage');
});

// Iteration 3 step 2
app.get('/artist-search', (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // dans le terminal, on voit data {artists:{ items:[[]]}}
    // pour voir le contenu de 'items' dans le terminal, enlever le commentaire ligne 39
    // console.log(data.body.artists.items);
    // on obtient url spotify, followers, genre, id, images, name, popularity, type, uri
    //on renvoie ces data
    res.render('artist-search-results', data.body.artists.items);
      
    // pour voir contenu de images dans le terminal: tableau de 3 objets, enlever commentaire ligne 45. Chaque objet contient 3 données : height, url, width.
    // console.log(data.body.artists.items[0].images)

    //pour voir url de l'image de la plus petite de taille du 1er item, enlever commentaire ligne 48
    // console.log(data.body.artists.items[0].images[2].url)
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));  
});

// Iteration 4
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    console.log('Album information: ', data.body);
    //pour voir le contenu de 'images dans le terminal, enlever le commentaire ligne 60
    // console.log(data.body.items[0].images)
    res.render('albums', data.body.items );
  })
  .catch(err => console.log('The error while getting artist albums is: ', err));
});

app.listen(3500, () => console.log('My Spotify project running on port 3500 🎧 🥁 🎸 🔊'));
