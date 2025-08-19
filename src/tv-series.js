import {
  getAiringTV,
  getPopularSeries,
  getTopRatedTV,
  getOnTheAirTV,
  getGenreTVInformation,
  getSearchSeriesInfo,
  getYoutubeSeries,
  getKeywordsSeries,
} from "./api/tmdbApi.js";

$(document).ready(function () {
  const currentPage = window.location.pathname.split("/").pop();
  console.log("currentPage", currentPage);
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

//tv start

$(document).ready(function () {
  $(".search-section form").on("submit", function (e) {
    e.preventDefault();

    const keyword = $("#site-search").val();

    if (keyword) {
      getKeywordsSeries(keyword)
        .then((data) => {
          console.log("getKeywordsSeries", data);
          searchingMovieList(data);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    }
  });
});

getPopularSeries()
  .then((data) => {
    mainSeriesBannerList(data);
    trendingSeriesList(data);
    initSlider();
  })
  .catch((error) => {
    console.error("Error fetching series:", error);
  });

getAiringTV()
  .then((data) => {
    console.log(data);
    nowPlayingSeriesList(data);
  })
  .catch((error) => {
    console.error("Error fetching series:", error);
  });

getTopRatedTV()
  .then((data) => {
    TopRatedSeriesList(data);
  })
  .catch((error) => {
    console.error("Error fetching series:", error);
  });

getOnTheAirTV()
  .then((data) => {
    UpcomingReleasesSeriesList(data);
  })
  .catch((error) => {
    console.error("Error fetching series:", error);
  });

//tv start
getGenreTVInformation()
  .then((data) => {
    GenreInformationSeriesList(data);
  })
  .catch((error) => {
    console.error(error);
  });

//series info and modal
$(document).on("click", ".card", function () {
  const seriesId = $(this).data("id");

  series;
  Promise.all([getSearchSeriesInfo(seriesId), getYoutubeSeries(seriesId)])
    .then(([seriesData, videoData]) => {
      seriesData.videos = videoData.results;
      console.log("seriesData.videos", seriesData.videos);
      displaySeriesModal(seriesData);
    })
    .catch((error) => console.error(error));
});

$(document).on("click", ".watch-btn", function () {
  const seriesId = $(this).data("id");

  Promise.all([getSearchSeriesInfo(seriesId), getYoutubeSeries(seriesId)])
    .then(([seriesData, videoData]) => {
      seriesData.videos = videoData.results;
      displaySeriesModal(seriesData);
    })
    .catch((error) => console.error(error));
});

getSearchSeriesInfo(seriesId)
  .then((data) => {
    GenreInformationList(data);
  })
  .catch((error) => {
    console.error("Error fetching series:", error);
  });

function mainSeriesBannerList(arr) {
  let imgHtml = "";

  arr.results.forEach((el, index) => {
    imgHtml += `
    <img
      src="${
        el.backdrop_path
          ? `https://image.tmdb.org/t/p/w185/${el.backdrop_path}`
          : "../images/noimageavailable.png"
      }"
    />
    <h2>${el.name}</h2>
    
    <button class="watch-btn" data-id="${
      el.id
    }" data-index="${index}">Watch More</button>
    `;
  });

  $(".slider-wrapper").append(imgHtml);
}

function trendingSeriesList(arr) {
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
              <div class="title">${el.name.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.first_air_date}</span>
              </div>
            </div>
    `;
  });
  $(".airing-today .cards-wrapper").append(imgHtml);
}

function displaySeriesModal(post) {
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
                  post.backdrop_path
                    ? `https://image.tmdb.org/t/p/w500/${post.backdrop_path}`
                    : "../images/noimageavailable.png"
                }"
              />
          </div>
          <span class="close-btn">&times;</span>
          <h2 class="title">${post.name}</h2>
          <p class="date"><strong>Release Date:</strong> ${
            post.first_air_date
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

function nowPlayingSeriesList(arr) {
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
              <div class="title">${el.name.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.first_air_date}</span>
              </div>
            </div>
    `;
  });
  $(".popular-series .cards-wrapper").append(imgHtml);
}

function TopRatedSeriesList(arr) {
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
              <div class="title">${el.name.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.first_air_date}</span>
              </div>
            </div>
    `;
  });
  $(".top-rated-series .cards-wrapper").append(imgHtml);
}

function UpcomingReleasesSeriesList(arr) {
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
              <div class="title">${el.name.substring(0, 20)}</div>
              <div class="content">
                <span class="rate"></span> ⭐️${el.vote_average.toFixed(1)} |
                <span class="date">${el.first_air_date}</span>
              </div>
            </div>
    `;
  });
  $(".on-the-air .cards-wrapper").append(imgHtml);
}

function GenreInformationSeriesList(arr) {
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
                    ? `https://image.tmdb.org/t/p/w185/${el.backdrop_path}`
                    : "../images/noimageavailable.png"
                }"
              />
              <div class="title">${el.name.substring(0, 20)}</div>
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
