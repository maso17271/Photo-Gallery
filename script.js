// Constant variable to store access key for Unsplash API
const accessKey = // place access key here

// the 'form' or search for images section
const searchBar = document.querySelector("form");

// variable to get user input
const inputElement = document.getElementById("search-input");

// variable for the results section
const searchResults = document.querySelector(".search-results");

// No more images button
const noMore = document.getElementById("no-more-button");

// attempt at lazy loading
const targets = document.querySelectorAll("img");

// store user input
let userInput = "";

// set page number for scrolling and for fetching images from the api.
let page = 1;

// create the function to search for images
// async to await image retrieval
async function searchImages() {
  // determine the search term from the user input
  userInput = inputElement.value;
  // prevent clearing the gallery on no input
  if (userInput === "") {
    return;
  }
  // set up the url for pulling images
  // use variables to set what is queried and what page of results
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${userInput}&client_id=${accessKey}`;
  // attempt to obtain images from url
  try {
    // wait for response before moving on
    const response = await fetch(url);

    // verify suitable response if not throw error
    if (!response.ok) {
      throw new Error(
        "Incorrect Network Response! Check that you are connected and try again!"
      );
    }
    // parse the response into JSON data into data variable
    const data = await response.json();

    // parse results from the JSON data
    const results = data.results;

    // clear any lingering search results
    if (page === 1) {
      searchResults.innerHTML = "";
    }

    // iterate through the parsed results array and execute below function
    results.map((result) => {
      // create a new div element that will hold image content
      const imageWrapper = document.createElement("div");

      // add the image Wrapper to search-result class to be styled
      imageWrapper.classList.add("search-result");

      // creates an image element
      const image = document.createElement("img");

      // sets the source to the small url parsed from result
      image.src = result.urls.small;
      image.alt = result.alt_description;

      // parse the author name using the account user name
      const authorName = document.createElement("p");
      authorName.textContent = `By ${result.user.name}`;

      // create anchors for the hypertext link
      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";
      // set the hyperlink to the image description
      imageLink.textContent = result.alt_description;

      // set the elements within the image wrapper
      imageWrapper.appendChild(image);
      imageWrapper.appendChild(imageLink);
      imageWrapper.appendChild(authorName);

      // place the image wrapper in search results
      searchResults.appendChild(imageWrapper);

      // attempt to lazy load the images
      lazyLoadImagesInResults();
    });

    // increment the page number
    page++;

    // show the view more button if page is higher than one
    /* No longer needed with infinite scroll
        if(page > 1){
                showMore.style.display = "block"
        }
        */
    // provide a button to show that no more images can be loaded.
  } catch (error) {
    console.error("There was an error loading images:", error);
    // change the page to display error to the user
    noMore.style.display = "block";
  }
}
// set homepage variable for infinite scroll
let homepage = true;

// add search bar functionality, waiting for an input from user
searchBar.addEventListener("submit", (event) => {
  event.preventDefault();

  // reset page variable to 1
  page = 1;
  searchImages();
  homepage = false;
});

// set up the infinite scroll based on position of scroll and window height
// make sure doesnt occur on homepage
window.addEventListener("scroll", () => {
  if (
    !homepage &&
    window.scrollY + window.innerHeight + 20 >= document.documentElement.scrollHeight
  ) {
    // search image if reach the end of the page
    searchImages();
  }
});

/* Button to load images if preferred 
showMore.addEventListener("click", () =>{
        searchImages();
});
*/

// attempted lazy load function using target parameter
const lazyLoad = (target) => {
  // create instance of the IntersectionObserver API
  const io = new IntersectionObserver((entries, observer) => {
    // loop through all entries within entry
    entries.forEach((entry) => {
      // check if ing intersects with target
      if (entry.isIntersecting) {
        //retrieve observed image
        const img = entry.target;
        // set the source
        const src = img.getAttribute("lazy-data");
        // setting src of img to lazy-data value
        img.setAttribute("src", src);
        //add "fade" effect
        img.classList.add("fade");
        // stop observing once loaded
        observer.unobserve(img);
      }
    });
  });
  // observe the target image
  io.observe(target);
};

// iterate over each image and call lazyload
targets.forEach(lazyLoad);

// defined function to use within search image loop
const lazyLoadImagesInResults = () => {
  const newImages = searchResults.querySelectorAll("img[lazy-data]:not(.fade)");
  newImages.forEach(lazyLoad);
  // console.log("this has run");
};
