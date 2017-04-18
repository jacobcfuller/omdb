$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

/*Pull movies with omdb, and for each movie, output a card with the title and
  poster. If no poster, give stock image "no picture available"
*/
function getMovies(searchText){
  axios.get('http://www.omdbapi.com?s='+searchText)
    .then((response) => {
      console.log(response);
      let output = '';
      if (response.data.Response === "False"){
        console.log(response.data.Response);
        console.log(response.data.Error);
        noOutput = `
          <div class="col s12">
            <div class="card blue hoverable">
              <div class="card-content white-text center">
                <span class="card-title">Movie Not Found :(</span>
              </div>
            </div>
          </div>
        `;
        $('#movies').html(noOutput);
      } else {
      let movies = response.data.Search;
      $.each(movies, (index, movie) => {
        //Check for poster
        if(movie.Poster === "N/A"){
        movie.Poster = "No_picture_available.png";
        }
        //Create card for movie
        output += `
          <div class="col s12 m4">
          <a onclick="movieSelected('${movie.imdbID}')" href="#">
            <div class="card teal darken-2 hoverable">
              <div class="card-content white-text">
                <span class="card-title">${movie.Title}</span>
                <div class="card-image">
                  <img src="${movie.Poster}">
                </div>
              </div>
            </div>
          </a>
          </div>
        `;
      });
      $('#movies').html(output);
    }
    })
    .catch((err) => {
      console.log(err);
    });
}

/*modify url with imdb ID*/
function movieSelected(id){
  window.location = 'movie.html?movieId='+id;
  return false;
}

/* Get detailed data for the movie. parse params to get the movie id*/
function getMovie(){
  var urlParams = new URLSearchParams(window.location.search)
  movieId = urlParams.get('movieId')

  axios.get('http://www.omdbapi.com?i='+movieId)
    .then((response) => {
      console.log(response);
      let movie = response.data;
      if(movie.Poster === "N/A"){
        movie.Poster = "No_picture_available.png";
      }
      /* The following output html displays the movie details on the movie.html page*/
      let output =`
        <div class="row">
          <div class="col l8 m12 s12 ">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
          <div class="col l4 m12 s12">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn">View IMDB</a>
            <a href="omdb_search.html" class="btn">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
