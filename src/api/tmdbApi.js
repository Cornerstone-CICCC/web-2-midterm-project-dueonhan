const API_KEY = "80167a32740518a6df20198ea1d7efb3";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

export const getSearchMovieInfo = async (movieId) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getGenreInformation = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getGenreTVInformation = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getPopularMovies = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getNowPlayingMovies = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getTopRatedMovies = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getUpComingMovies = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getYoutubeMovies = async (movieId) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getKeywordsMovies = async (query) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=en-US&page=1&include_adult=false`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

// movies end

// tv series start
export const getAiringTV = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/airing_today?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getPopularSeries = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?language=en-US&page=2&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getTopRatedTV = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getOnTheAirTV = async () => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/on_the_air?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getSearchSeriesInfo = async (seriesId) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getYoutubeSeries = async (tvId) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tvId}/videos?language=en-US&api_key=${API_KEY}`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getKeywordsSeries = async (query) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=en-US&page=1&include_adult=false`,
      options
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

// tv series end
