const keys = require('./keys.js');
const request = require('request');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const inquirer = require('inquirer');
const fs = require('fs');


var userInput = process.argv[2];
var spotifyError = process.argv[3];

var twitterClient = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

var twitterParams = {
    q: 'DingDongBoink',
    count: 20
};

var spotifyClient = new Spotify({
    id: keys.spotifyKeys.client_id,
    secret: keys.spotifyKeys.client_secret
});


switch (userInput) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        mySpotify();
        break;

    case "movie-this":
        myMovie(process.argv[3]);
        break;

    case "do-what-it-says":
        doIt();
        break;

    default:
        console.log("**Invalid Input** Takes the following cases: 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'");
}

function myTweets() {
    twitterClient
        .get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
            if (error) {
                console.log("error");
            }
            for (i = 0; i < twitterParams.count; i++) {
                console.log("\n" + tweets[i].created_at + "\n" + tweets[i].text);
            }
        });
}


function Song(answers) {
    this.answers = answers;
}

function mySpotify() {
    if (spotifyError) {
        return console.log("Rerun using only 'spotify-this-song'");
    }
    inquirer.prompt([{
        name: "songChoice",
        message: "Choose a song!"
    }]).then(function(answers) {
        var songChoice = new Song("songChoice");
        spotifyClient
            .search({ type: 'track', query: answers.songChoice, limit: 1 })
            .then(function(response, err) {
                console.log('', "\n");
                console.log("Artist:" + "\n", "   " + response.tracks.items[0].artists[0].name);
                console.log("Title:" + "\n", "   " + response.tracks.items[0].name);
                console.log("Album:" + "\n", "   " + response.tracks.items[0].album.name);
                console.log("Preview Link:" + "\n", "   " + response.tracks.items[0].href);
            })
            .catch(function(err) {
                spotifyClient
                    .search({ type: 'track', query: "The Sign", limit: 1 })
                console.log('', "\n");
                console.log("Artist:" + "\n", "   " + response.tracks.items[0].artists[0].name);
                console.log("Title:" + "\n", "   " + response.tracks.items[0].name);
                console.log("Album:" + "\n", "   " + response.tracks.items[0].album.name);
                console.log("Preview Link:" + "\n", "   " + response.tracks.items[0].href);
            })
    })
}




function myMovie() {
    request("http://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
        console.log('', body);
        console.log('\n');
        var titleTag = body.slice(body.indexOf("Title"), body.indexOf(","));
        if (titleTag) {
            for (i = 0; i < titleTag.length; i++) {
                titleTag = titleTag.replace('"', "");
                titleTag = titleTag.replace(',', "");
            }
            console.log(titleTag);
        } else {
            return console.log("Check your spelling ya'dingus!");
        }

        var yearTag = body.slice(body.indexOf("Year"), body.indexOf('Rated'));
        for (i = 0; i < yearTag.length; i++) {
            yearTag = yearTag.replace('"', "");
            yearTag = yearTag.replace(',', "");
        }
        console.log(yearTag);

        var imdbRatingTag = body.slice(body.indexOf("Internet Movie Database"), body.indexOf("}"));
        if (imdbRatingTag) {
            imdbRatingTag = imdbRatingTag.replace('Internet Movie Database","Value":"', "IMDB Rating:");
            imdbRatingTag = imdbRatingTag.replace('"', "");
            console.log(imdbRatingTag);
        } else {
            console.log("No IMDB Rating");
        }

        var rottenRatedTag = body.slice(body.indexOf("Rotten Tomatoes"), body.indexOf("%"));
        if (rottenRatedTag) {
            rottenRatedTag = rottenRatedTag.replace('Rotten Tomatoes","Value":"', "Rotten Tomatoes Rating:");
            console.log(rottenRatedTag + "%");
        } else {
            console.log("No Rotten Tomatoes Rating");
        }

        var countryTag = body.slice(body.indexOf("Country"), body.indexOf("Awards"));
        if (countryTag) {
            for (i = 0; i < countryTag.length; i++) {
                countryTag = countryTag.replace('"', "");
                countryTag = countryTag.replace(',', "");
            }
            console.log(countryTag);
        } else {
            console.log("No Country Listed");
        }


        var languageTag = body.slice(body.indexOf("Language"), body.indexOf("Country"));
        if (languageTag) {
            for (i = 0; i < languageTag.length; i++) {
                languageTag = languageTag.replace('"', "");
                languageTag = languageTag.replace(',', "");
            }
            console.log(languageTag);
        } else {
            console.log("No Language Listed");
        }

        var plotTag = body.slice(body.indexOf("Plot"), body.indexOf("Language"));
        if (plotTag) {
            for (i = 0; i < plotTag.length; i++) {
                plotTag = plotTag.replace('"', "");
                plotTag = plotTag.replace(',', "");
            }
            console.log(plotTag);
        } else {
            console.log("No Plot Listed");
        }

        var actorTag = body.slice(body.indexOf("Actors"), body.indexOf("Plot"));
        if (actorTag) {
            for (i = 0; i < actorTag.length; i++) {
                actorTag = actorTag.replace('"', "");
                actorTag = actorTag.replace(',', "");
            }
            console.log(actorTag);
        } else {
            console.log("No Actors Listed");
        }

    });

};


function doIt(callback) {
    fs.readFile("./random.txt", "utf8", function(err, content) {
        if (err) {
            return (err)
        }
        console.log('', content);
    })
}
