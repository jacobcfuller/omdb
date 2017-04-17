$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

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
        output += `
          <div class="col s12 m4">
          <a onclick="movieSelected('${movie.imdbID}')" href="#">
            <div class="card blue hoverable">
              <div class="card-content white-text">
                <span class="card-title">${movie.Title}</span>
              </div>
              <div class="card-image">
                <img src="${movie.Poster}">
              </div>
            </div>
          </a>    
          </div>          
        `;
      });
      console.log(output);
      $('#movies').html(output);
    }
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id){
  window.location = 'movie.html?movieId='+id;
  return false;
}

function getMovie(){
  var urlParams = new URLSearchParams(window.location.search)
  movieId = urlParams.get('movieId')

  axios.get('http://www.omdbapi.com?i='+movieId)
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
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
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="omdb_search.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}