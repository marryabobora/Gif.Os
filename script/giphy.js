const API_URL = 'https://api.giphy.com/v1/';
const API_KEY = '?api_key=9D2bUv4FYyl2KVVDIZyIcZQD1aUSUBU2';
const UPLOAD_URL = 'https://upload.giphy.com/v1/gifs';
const SUGGESTED_URL = 'https://api.giphy.com/v1/gifs/search/tags';

var random_id = null; 

console.log("giphy.js :D");

function getRandomID(callback)
{
	random_id = localStorage.getItem('random_id');

	if(random_id == null)
	{
	    fetch(API_URL + 'randomid' + API_KEY)
	        .then((response) => {
	            return response.json();
	        })
	        .then(blob => {
	        	random_id = blob.data.random_id;
	        	localStorage.setItem('random_id', random_id);

                callback();

	        	return random_id;
	        })
	        .catch((error) => {
	        	random_id = null;
    			console.error(error);

	            return null;
        });
	}

    callback();

	return random_id;
}

function buscarGifs(search, callback) {
    let url = API_URL + 'gifs/search' + API_KEY + '&q=' + search;
    
    if(random_id != null)
        url += '&random_id=' + random_id;

    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then(blob => {
        console.log('SEARCH BLOB:');
        console.log(blob);

        callback(blob);
    })
    .catch((error) => {
        console.error(error);
        return error;
    });
}

function trendingGifs(offset, max, callback) {
    let url = API_URL + 'gifs/trending' + API_KEY
     + '&limit=' + max
     + '&offset=' + offset;
    
    if(random_id != null)
        url += '&random_id=' + random_id;

    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then(blob => {
        console.log('TRENDING BLOB:');
        console.log(blob);

        callback(blob);
    })
    .catch((error) => {
        console.error(error);
        return error;
    });
}

function getGifs(gifIDs, callback) {
    let url = API_URL + 'gifs' + API_KEY + '&ids=';
    
    for (var i = gifIDs.length - 1; i >= 0; i--) {
        url += gifIDs[i].id + ",";
    }

    if(random_id != null)
        url += '&random_id=' + random_id;

    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then(blob => {
        console.log('MYGIFS BLOB:');
        console.log(blob);

        callback(blob);
    })
    .catch((error) => {
        console.error(error);
        return error;
    });
}

function suggestedSearches(term, callback) {
    let url = SUGGESTED_URL + API_KEY
                    + '&q=' + term;

    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then(blob => {
        console.log('SUGGESTED BLOB for '+term+':');
        console.log(blob);

        callback(term, blob);
    })
    .catch((error) => {
    	console.error(error);
        return error;
    });
}