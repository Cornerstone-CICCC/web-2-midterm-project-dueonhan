import {
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpComingMovies,
  getGenreInformation,
  getSearchMovieInfo,
  getYoutubeMovies,
  getKeywordsMovies,
} from "./api/tmdbApi.js";

$(document).ready(function () {
  const currentPage = window.location.pathname.split("/").pop();

  $(".menu ul li a").each(function () {
    const linkPage = $(this).attr("href").split("/").pop();
    if (linkPage === currentPage) {
      $(this).addClass("active");
    }
  });
});

//mode change
$(window).on("load", function () {
  $(".modes").on("click", function () {
    console.log("click");
    $(this).find(".round").toggleClass("active");
    $(this).find(".round-circle").toggleClass("active");

    if ($("body").hasClass("light-mode")) {
      $("body").removeClass("light-mode").addClass("dark-mode");
    } else {
      $("body").removeClass("dark-mode").addClass("light-mode");
    }
  });
});

function initSlider() {
  // banner image slider
  let i = 0;
  const imgs = $(".slider-wrapper img");
  const titles = $(".slider-wrapper h2");
  const buttons = $(".slider-wrapper button");

  imgs.css({ position: "absolute", top: 0, left: 0 }).hide();
  titles.css({ position: "absolute", bottom: "80px", left: "20px" }).hide();
  buttons.css({ position: "absolute", bottom: "30px", left: "20px" }).hide();

  imgs.eq(0).show();
  titles.eq(0).show();
  buttons.eq(0).show();

  setInterval(function () {
    let prevIndex = i;
    i = (i + 1) % imgs.length;

    let currentImg = imgs.eq(i);
    let currentTitle = titles.eq(i);
    let currentButtons = buttons.eq(i);

    let prevImg = imgs.eq(prevIndex);
    let prevTitle = titles.eq(prevIndex);
    let prevButtons = buttons.eq(prevIndex);

    currentImg.css({ left: "100%" }).show();
    currentTitle.css({ left: "100%" }).show();
    currentButtons.css({ left: "100%" }).show();

    prevImg.animate({ left: "-100%" }, 1000, function () {
      $(this).hide();
    });
    prevTitle.animate({ left: "-100%" }, 1000, function () {
      $(this).hide();
    });
    prevButtons.animate({ left: "-100%" }, 1000, function () {
      $(this).hide();
    });

    currentImg.animate({ left: "0%" }, 1000);
    currentTitle.animate({ left: "0%" }, 1000);
    currentButtons.animate({ left: "0%" }, 1000);
  }, 3000);
}

$(document).ready(function () {
  $(".search-section form").on("submit", function (e) {
    e.preventDefault();

    const keyword = $("#site-search").val();

    if (keyword) {
      getKeywordsMovies(keyword)
        .then((data) => {
          console.log("getKeywordsMovies", data);
          searchingMovieList(data);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  });
});

getPopularMovies()
  .then((data) => {
    console.log("data", data);
    homeMoviesList(data);
    mainMoviesbannerList(data);
    trendingMovieList(data);
    initSlider();
    aoubtMoviesList(data);
  })
  .catch((error) => {
    console.error("Error fetching movies:", error);
  });

getNowPlayingMovies()
  .then((data) => {
    nowPlayingMovieList(data);
  })
  .catch((error) => {
    console.error("Error fetching movies:", error);
  });

getTopRatedMovies()
  .then((data) => {
    TopRatedMovieList(data);
  })
  .catch((error) => {
    console.error("Error fetching movies:", error);
  });

getUpComingMovies()
  .then((data) => {
    UpcomingReleasesMovieList(data);
  })
  .catch((error) => {
    console.error("Error fetching movies:", error);
  });

getGenreInformation()
  .then((data) => {
    GenreInformationList(data);
  })
  .catch((error) => {
    console.error(error);
  });

//movie info and modal
$(document).on("click", ".card", function () {
  const movieId = $(this).data("id");
  console.log("movie ID:", movieId);

  Promise.all([getSearchMovieInfo(movieId), getYoutubeMovies(movieId)])
    .then(([movieData, videoData]) => {
      movieData.videos = videoData.results;
      console.log("movieData", movieData);
      displayMovieModal(movieData);
    })
    .catch((error) => console.error(error));
});

$(document).on("click", ".watch-btn", function () {
  const movieId = $(this).data("id");

  Promise.all([getSearchMovieInfo(movieId), getYoutubeMovies(movieId)])
    .then(([movieData, videoData]) => {
      movieData.videos = videoData.results;
      displayMovieModal(movieData);
    })
    .catch((error) => console.error(error));
});

getSearchMovieInfo(movieId)
  .then((data) => {
    GenreInformationList(data);
  })
  .catch((error) => {
    console.error("Error fetching movies:", error);
  });

function homeMoviesList(arr) {
  let imgHtml = "";

  arr.results.forEach((el) => {
    imgHtml += `<div class="photo">
    <img
                src="${
                  el.backdrop_path
                    ? `https://image.tmdb.org/t/p/w185/${el.backdrop_path}`
                    : "../images/noimageavailable.png"
                }"
              />
    </div>`;
  });
  $(".photos-wrapper").append(imgHtml);
}

function mainMoviesbannerList(arr) {
  let imgHtml = "";

  arr.results.forEach((el, index) => {
    imgHtml += `
    <img
      src="${
        el.backdrop_path
          ? `https://image.tmdb.org/t/p/w500/${el.backdrop_path}`
          : "../images/noimageavailable.png"
      }"
    />
    <h2>${el.title}</h2>
    
    <button class="watch-btn" data-id="${
      el.id
    }" data-index="${index}">Watch More</button>
    `;
  });

  $(".slider-wrapper").append(imgHtml);
}

function trendingMovieList(arr) {
  let imgHtml = "";

  arr.results.forEach((el, index) => {
    imgHtml += `
      <div class="card" data-id="${el.id}">
              <img
                src="${
                  el.backdrop_path
                    ? `https://image.tmdb.org/t/p/w185/${el.backdrop_path}`
                    : "../images/noimageavailable.png"
                }"
              />
              <div class="title">${el.title.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.release_date}</span>
              </div>
            </div>
    `;
  });
  $(".trending .cards-wrapper").append(imgHtml);
}

function displayMovieModal(post) {
  const button = $(`.close-btn`);
  const hasVideo = post.videos?.length > 0;

  $(document).on("click", ".close-btn", function () {
    const $modal = $(this).closest(".modal");

    const $iframe = $modal.find("iframe");
    if ($iframe.length) {
      $iframe.attr("src", "");
    }

    $modal.hide();
  });

  $(".modal")
    .html(
      `
      <div class="modal-content">
          <div class="modal-img">
            <img
              src="${
                post.poster_path && post.poster_path !== "null"
                  ? `https://image.tmdb.org/t/p/w500/${post.poster_path}`
                  : "../images/noimageavailable.png "
              }"
            />
          </div>
          <span class="close-btn">&times;</span>
          <h2 class="title">${post.title}</h2>
          <p class="date"><strong>Release Date:</strong> ${
            post.release_date
          }</p>
          <p class="tagline"><strong>Tagline:</strong> ${post.tagline}</p>
          <p class="overview">
            ${post.overview}
          </p>
          <p class="genres">
            <strong>Genres:</strong> ${post.genres
              .map((g) => g.name)
              .join(", ")}
          </p>
          <p class="rates">
            <strong>Rating:</strong>⭐${post.vote_average} (
            <span class="votes">${post.vote_count} votes</span> )
          </p>
              <div class="video-wrapper" style="display: ${
                hasVideo ? "block" : "none"
              };">

          ${
            post.videos?.length
              ? `<iframe width="100%" height="auto" src="https://www.youtube.com/embed/${
                  post.videos.find(
                    (v) => v.site === "YouTube" && v.type === "Trailer"
                  )?.key
                }" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
              : ""
          }
          </iframe>
          </div>
        </div>
    `
    )
    .append(button)
    .fadeIn();
}

function nowPlayingMovieList(arr) {
  let imgHtml = "";

  arr.results.forEach((el, index) => {
    imgHtml += `
      <div class="card" data-id="${el.id}">
              <img
                src="${
                  el.backdrop_path
                    ? `https://image.tmdb.org/t/p/w185/${el.backdrop_path}`
                    : "../images/noimageavailable.png"
                }"
              />
              <div class="title">${el.title.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.release_date}</span>
              </div>
            </div>
    `;
  });
  $(".nowPlaying .cards-wrapper").append(imgHtml);
}

function TopRatedMovieList(arr) {
  let imgHtml = "";

  arr.results.forEach((el, index) => {
    imgHtml += `
      <div class="card" data-id="${el.id}">
              <img
                src="${
                  el.backdrop_path
                    ? `https://image.tmdb.org/t/p/w185/${el.backdrop_path}`
                    : "../images/noimageavailable.png"
                }"
              />
              <div class="title">${el.title.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.release_date}</span>
              </div>
            </div>
    `;
  });
  $(".TopRated .cards-wrapper").append(imgHtml);
}

function UpcomingReleasesMovieList(arr) {
  let imgHtml = "";

  arr.results.forEach((el, index) => {
    imgHtml += `
      <div class="card" data-id="${el.id}">
              <img
                src="${
                  el.backdrop_path
                    ? `https://image.tmdb.org/t/p/w185/${el.backdrop_path}`
                    : "../images/noimageavailable.png"
                }"
              />
              <div class="title">${el.title.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.release_date}</span>
              </div>
            </div>
    `;
  });
  $(".Upcoming-Releases .cards-wrapper").append(imgHtml);
}

function GenreInformationList(arr) {
  let imgHtml = "";

  arr.genres.forEach((el, index) => {
    imgHtml += `
      <li><a href="#">${el.name}</a></li>
    `;
  });
  $(".genre-lists").append(imgHtml);
}

function searchingMovieList(arr) {
  let imgHtml = "";

  arr.results.forEach((el, index) => {
    imgHtml += `
      <div class="card" data-id="${el.id}">
              <img
                src="${
                  el.backdrop_path
                    ? `https://image.tmdb.org/t/p/w500/${el.backdrop_path}`
                    : "../images/noimageavailable.png"
                }"
              />
              <div class="title">${el.title.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.release_date}</span>
              </div>
            </div>
    `;
  });
  $(".result").show();
  $(".result .cards-wrapper").html(imgHtml);
}

// about
//
function aoubtMoviesList(arr) {
  let imgHtml = "";

  arr.results.forEach((el, index) => {
    const num = index + 1;
    let slideClass = "";

    if (num >= 1 && num <= 5) {
      slideClass = "slide-right";
    } else if (num >= 6 && num <= 10) {
      slideClass = "slide-left";
    } else if (num >= 11 && num <= 15) {
      slideClass = "slide-right";
    } else if (num >= 16 && num <= 20) {
      slideClass = "slide-left";
    }

    if (num % 5 === 1) {
      imgHtml += `<div class="img-row ${slideClass}">`;
    }

    imgHtml += `
      <div class="imgs">
        <img
            src="${
              el.backdrop_path
                ? `https://image.tmdb.org/t/p/w500/${el.backdrop_path}`
                : "../images/noimageavailable.png"
            }"
          />
      </div>
    `;

    if (num % 5 === 0) {
      imgHtml += `</div>`;
    }
  });

  $(".about-page .main_section .img-wrapper").append(imgHtml);
}
