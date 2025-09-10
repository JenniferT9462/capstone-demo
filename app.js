console.log("Hello from app.js!");

// Testing IDs
// setProperty("send-btn", "color", "purple");
// setProperty("user-prompt", "color", "blue");
// setProperty("output", "color", "yellow");

function handleClick() {
  console.log("Send Button Clicked");
  setText("output", "Hello from the button!");
  handleInput();
  
}

function handleInput() {
  let userPrompt = getValue("user-prompt");
  console.log("User Input: ", userPrompt);
  if (userPrompt === "") {
    setText("output", "⚠️ Please type something!!!");
    setProperty("output", "color", "red");
  } else {
    setText("output", `You typed "${userPrompt}", in the input area!`);
    setProperty("output", "color", "green");
  }
   // Clear the input box
  setValue("user-prompt", "");
}

onEvent("send-btn", "click", handleClick);

//GIPHY API endpoint: https://api.giphy.com/v1/gifs/search?api_key=45lMYWBtftfL8e1d84qfFTQH9VogaW1q&q=horror+movie+clips&limit=25&offset=0&rating=r&lang=en&bundle=messaging_non_clips
function fetchHorrorMovieGif() {
  console.log("Fetching Horror Movie Gif");
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_TOKEN}&q=horror+movie+clips&limit=10&offset=0&rating=r&lang=en&bundle=messaging_non_clips`,
    requestOptions
  )
    .then((response) => response.json())
    .then(function (result) {
      console.log(result);
      console.log(result.data[9].url);
     
    })

    .catch((error) => console.error(error));
}