//.env files contain client id and secret key for Spotify
require("dotenv").config();

// defining all necessary vars
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
//vars to capture user inputs.
var userCommand = process.argv[2]; 
var userTitleInput = process.argv[3];

//function for recognizing user's command
function UserInputs (userCommand, userTitleInput)
{
    switch (userCommand) 
    {
    case 'concert-this':
        showConcertInfo(userTitleInput);
        break;
    case 'spotify-this-song':
        showSongInfo(userTitleInput);
        break;
    case 'movie-this':
        showMovieInfo(userTitleInput);
        break;
    case 'do-what-it-says':
        showSomeInfo();
        break;
    default: 
        console.log("Invalid Command. Enter Any Of The Following: \nconcert-this <your artist choice> \nspotify-this-song <your song choice> \nmovie-this <your movie choice>\ndo-what-it-says")
    }
}

//calling the main function
UserInputs(userCommand, userTitleInput);

//extracting events info from BandsInTown
function showConcertInfo(userTitleInput)
{
    var queryUrl = "https://rest.bandsintown.com/artists/" + userTitleInput + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) 
    {
        if (!error && response.statusCode === 200) 
        {
            var concerts = JSON.parse(body);
            for (var i = 0; i < concerts.length; i++) 
            {  
                console.log("~-~-~-~-~-~EVENT INFO for " + userTitleInput + "~-~-~-~-~-~");  
                fs.appendFileSync("log.txt", "~-~-~-~-~-~EVENT INFO for " + userTitleInput + "~-~-~-~-~-~\n");//Append in log.txt file
                console.log(i);
                fs.appendFileSync("log.txt", i+"\n");
                console.log("Venue: " + concerts[i].venue.name);
                fs.appendFileSync("log.txt", "Venue: " + concerts[i].venue.name+"\n");
                console.log("Location: " +  concerts[i].venue.city);
                fs.appendFileSync("log.txt", "Location: " +  concerts[i].venue.city+"\n");
                console.log("Event Date: " +  concerts[i].datetime);
                fs.appendFileSync("log.txt", "Event Date: " +  concerts[i].datetime+"\n");
                console.log("~-~-~-~-~-~~-~-~-~-~-~-~-~-~-~-~~-~-~-~-~-~-~-~-~");
                fs.appendFileSync("log.txt", "~-~-~-~-~-~~-~-~-~-~-~-~-~-~-~-~~-~-~-~-~-~-~-~-~"+"\n");
            }
        } 
        else
        {
            console.log('Error occurred.');
        }
    });
}

//extracting song info from Spotify
function showSongInfo(userTitleInput) 
{
    if (userTitleInput === undefined) 
    {   //default song choice
        userTitleInput = "The Sign"; 
    }
    spotify.search(
        {
            type: "track",
            query: userTitleInput
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("~-~-~-~-~-~SONG INFO~-~-~-~-~-~");
                fs.appendFileSync("log.txt", "~-~-~-~-~-~SONG INFO~-~-~-~-~-~\n");
                console.log(i);
                fs.appendFileSync("log.txt", i +"\n");
                console.log("Title: " + songs[i].name);
                fs.appendFileSync("log.txt", "title: " + songs[i].name +"\n");
                console.log("Preview: " + songs[i].preview_url);
                fs.appendFileSync("log.txt", "preview: " + songs[i].preview_url +"\n");
                console.log("Album: " + songs[i].album.name);
                fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
                console.log("Artist(s): " + songs[i].artists[0].name);
                fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
                console.log("~-~-~-~-~-~~-~-~-~-~-~~-~-~-~-~-~");  
                fs.appendFileSync("log.txt", "~-~-~-~-~-~~-~-~-~-~-~~-~-~-~-~-~\n");
             }
        }
    );
};

//extracting movie infro from OMDB
function showMovieInfo(userTitleInput){
    if (userTitleInput === undefined) {
        userTitleInput = "Mr. Nobody"
        console.log("---------------------------------------------------------------------");
        fs.appendFileSync("log.txt", "---------------------------------------------------------------------\n");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +"\n");
        console.log("It's on Netflix!");
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userTitleInput + "&y=&plot=short&apikey=b4beb217";
    request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var movies = JSON.parse(body);
        console.log("**********MOVIE INFO*********");  
        fs.appendFileSync("log.txt", "**********MOVIE INFO*********\n");
        console.log("Title: " + movies.Title);
        fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
        console.log("Release Year: " + movies.Year);
        fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
        console.log("IMDB Rating: " + movies.imdbRating);
        fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
        console.log("Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies));
        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + getRottenTomatoesRatingValue(movies) + "\n");
        console.log("Country of Production: " + movies.Country);
        fs.appendFileSync("log.txt", "Country of Production: " + movies.Country + "\n");
        console.log("Language: " + movies.Language);
        fs.appendFileSync("log.txt", "Language: " + movies.Language + "\n");
        console.log("Plot: " + movies.Plot);
        fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
        console.log("Actors: " + movies.Actors);
        fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
        console.log("**********************************************************");  
        fs.appendFileSync("log.txt", "**********************************************************\n");
    } else{
      console.log('Error occurred.');
    }

});}

//extracting Rotten Tomatoes Rating
function getRottenTomatoesRatingObject (data) {
    return data.Ratings.find(function (item) {
       return item.Source === "Rotten Tomatoes";
    });
  }
  
  function getRottenTomatoesRatingValue (data) {
    return getRottenTomatoesRatingObject(data).Value;
  }

//taking in command from random.txt file  
function showSomeInfo(){
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){ 
			return console.log(err);
		}
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
	});
}
