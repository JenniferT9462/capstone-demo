console.log("Hello from app.js!");

onEvent("playBtn", "click", function() {
  playSound("horror-sound.mp3", true);
})


// Testing IDs
// setProperty("send-btn", "color", "purple");
// setProperty("user-prompt", "color", "blue");
// setProperty("output", "color", "yellow");

function handleClick() {
  console.log("Send Button Clicked");
  // setText("output", "Hello from the button!");
  let userPrompt = getValue("user-prompt");
  handleInput(userPrompt);
  sendToModel(userPrompt);

}

function handleInput(userPrompt) {
  
  console.log("User Input: ", userPrompt);
  if (userPrompt === "") {
    setText("output", "⚠️ Please type something!!!");
    setProperty("output", "color", "red");
  } else {
    setText("output", `You typed "${userPrompt}", in the input area!`);
    setProperty("output", "color", "green");
  }
  // // Clear the input box
  setValue("user-prompt", "");
}

function handleGifGenerator() {
    fetchHorrorMovieGif();
}

onEvent("send-btn", "click", handleClick);
onEvent("gif-btn", "click", handleGifGenerator);

const gifDisplay = document.getElementById("gif-display");
//GIPHY API endpoint: https://api.giphy.com/v1/gifs/search?api_key=45lMYWBtftfL8e1d84qfFTQH9VogaW1q&q=horror+movie+clips&limit=25&offset=0&rating=r&lang=en&bundle=messaging_non_clips
function fetchHorrorMovieGif() {
  console.log("Fetching Horror Movie Gif");
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_TOKEN}&q=horror+movie&limit=25&offset=0&rating=r&lang=en&bundle=messaging_non_clips`,
    requestOptions
  )
    .then((response) => response.json())
    .then(function (result) {
      console.log(result);
      // The 'if' statement checks if the API response
      // contains data and if the 'data' array is not empty.
      if (result.data && result.data.length > 0) {
        // This line generates a random number that will serve as
        //  an index to pick a GIF from the array.
        // 'Math.random()' returns a number between 0 and 1,
        // and we multiply it by the number of GIFs
        // in the 'data' array. 'Math.floor()' rounds the number
        // down to the nearest whole integer.
        const randomIndex = Math.floor(Math.random() * result.data.length);
        // This line uses the 'randomIndex' to select a single,
        // random GIF object from the array of results.
        const randomGif = result.data[randomIndex];
        // This line accesses the URL of the selected GIF.
        //  The GIPHY API provides different image sizes,
        // and 'original.url' gives you the highest quality version.
        const gifUrl = randomGif.images.original.url;
        gifDisplay.hidden = false;
        gifDisplay.src = gifUrl;
        gifDisplay.alt = "A random horror movie GIF";
      }
    })

    .catch((error) => console.error(error));
}

onEvent("movieBtn", "click", function() {
  console.log("Movie button clicked!");
  fetchMovie();

});

function fetchMovie() {

const options = {
  //Get movies with discover and genres=27 for horror
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzNhNGIwNDdmZTBkMjU2MDUzODFlOGM3MTM1ZTQ5OCIsIm5iZiI6MTc1Nzc4Nzg3Ni43MDQsInN1YiI6IjY4YzViNmU0M2RiYjFjMWNiMmU2MTYyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yQgMOKpQud7-sFbUZ6Nk8-0PQIUh8D5Wlf8QqqqxqVA'
  }
};
const randomPage = Math.floor(Math.random() * 50) + 1; // gives 1–50
fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=true&language=en-US&page=${randomPage}&sort_by=popularity.desc&with_genres=27`, options)
  .then(res => res.json())
  .then(res => {
    console.log(res);
    let movies = res.results;

    // Random number between 0 and max-1
    let randomIndex = Math.floor(Math.random() * movies.length);
    
    let posterUrl = `https://image.tmdb.org/t/p/w342${res.results[randomIndex].poster_path}`
    setText("movie-title", res.results[randomIndex].original_title);
    setText("movie-overview", res.results[randomIndex].overview);
    setImageURL("movie-poster", posterUrl);
  })
  .catch(err => console.error(err));
}

//Get horror movies with search
//   const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YzNhNGIwNDdmZTBkMjU2MDUzODFlOGM3MTM1ZTQ5OCIsIm5iZiI6MTc1Nzc4Nzg3Ni43MDQsInN1YiI6IjY4YzViNmU0M2RiYjFjMWNiMmU2MTYyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yQgMOKpQud7-sFbUZ6Nk8-0PQIUh8D5Wlf8QqqqxqVA'
//   }
// };

// fetch('https://api.themoviedb.org/3/search/movie?query=horror%20movies&include_adult=true&language=en-US&page=1', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

function sendToModel(userPrompt) {
  
  async function query(data) {
	const response = await fetch(
		"https://router.huggingface.co/v1/chat/completions",
		{
			headers: {
				Authorization: `Bearer ${HF_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

query({ 
    messages: [
        {
            role: "user",
            content: `Tell me some Halloween facts about ${userPrompt}.`
        },
    ],
    model: "meta-llama/Llama-3.1-8B-Instruct:fireworks-ai",
}).then((response) => {
    console.log(JSON.stringify(response));
    let botReply = response.choices[0].message.content;
    setText("output", botReply);
});
}