import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const getPost = async (titles) => {
  const KEY = '0d38cc635c10e090910f3d7ea7194e05'; // Replace with your TMDb API key
  const URL = 'https://api.themoviedb.org/3';
  const promises = titles.map(async (title) => {
    // Search for the movie by title
    const tmdbResponse = await fetch(
      `${URL}/search/movie?api_key=${KEY}&language=ko-KR&page=1&query=${title}`
    );
    const tmdbJson = await tmdbResponse.json();
    // Filter out movies without a poster
    const moviesWithPoster = tmdbJson.results.filter(
      (movie) => movie.poster_path
    );

    if (moviesWithPoster.length > 0) {
      const movie = moviesWithPoster[0]; // Taking the first movie that has a poster
      // Fetch additional movie details by movie ID
      const movieDetailsResponse = await fetch(
        `${URL}/movie/${movie.id}?api_key=${KEY}&language=ko-KR&append_to_response=credits`
      );
      const movieDetailsJson = await movieDetailsResponse.json();
      const director = movieDetailsJson.credits.crew.find(
        (person) => person.job === 'Director'
      );
      const genres = movieDetailsJson.genres
        .slice(0, 2)
        .map((genre) => genre.name);

      return {
        title,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        director: director ? director.name : 'Director not found',
        genres: genres.join(' / '),
      };
    }

    // If no movies with posters are found, return null or an empty object
    return null;
  });

  // Filter out any null results
  return (await Promise.all(promises)).filter((movie) => movie !== null);
};


export default function MovieModal({ movie, overlap, onClose }) {
  if (!movie) return null;

  // Modal overlay styling
  const overlayStyle = {
    position: 'fixed', // Fixed position to cover the whole screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
    display: 'flex',
    alignItems: 'center', // Center the modal vertically
    justifyContent: 'center', // Center the modal horizontally
    zIndex: 1050, // High z-index to ensure it's above other elements
  };

  // Modal content styling
  const contentStyle = {
    backgroundColor: '#1C1E2C', // White background
    padding: '20px',
    borderRadius: '8px', // Rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // A subtle shadow
    minWidth: '300px', // Minimum width
    maxWidth: '600px', // Maximum width
    margin: '0 20px', // Margin for small screens
    textAlign: 'center', // Center the text
    color: '#FFF', // Dark text color
    fontFamily: 'Noto Sans KR',
  };

  // Image styling
  const imageStyle = {
    maxWidth: '30%', // Ensure the image is not bigger than the modal
    height: 'auto', // Keep the aspect ratio
  };

  // // Updated style for the synopsis section
  // const synopsisStyle = {
  //   textAlign: 'left', // Align text to the left
  //   marginTop: '10px', // Margin at the top
  //   maxHeight: '150px', // Maximum height for the synopsis section
  //   overflowY: 'auto', // Show a scrollbar when the content overflows
  //   padding: '10px', // Padding inside the scrollable area
  //   borderRadius: '5px', // Optional: for rounded corners inside the scrollable area
  //   backgroundColor: '#2A2F42', // Optional: different background color for synopsis
  //   boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)', // Optional: subtle inner shadow
  //   color: '#FFF', // Optional: text color
  //   marginBottom: '10px', // Optional: space at the bottom
  //   fontFamily: 'Inter',
  // };
  const posterStyle = {
    width: '300px',
    height: '450px',
    objectFit: 'cover',
    borderRadius: '5px',
  };
  const [youtubeVideoId, setYoutubeVideoId] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [isOverlapping, setIsOverlapping] = useState(false);
  const [MoviePost, setMoviePost] = useState([]);

  useEffect(() => {
    // Example usage - adjust titles as needed
    getPost([movie.title]).then((movies) => {
      if (movies.length > 0) {
        setMoviePost(movies[0]);
      }
    });
  }, [movie]);

  const handleReviewClick = (event) => {
    const searchType = event.target.value; // 버튼의 value 읽기
    const query = searchType === 'preview' ? '예고편' : '영화리뷰';
    setShowReview(true);
    searchYouTube(movie.title, query).then((videoId) =>
      setYoutubeVideoId(videoId)
    );
  };

  async function searchYouTube(title, type) {
    const apiKey = 'AIzaSyCAeJovYWAAohqbpHHgOft4WU5wQO9kmKM'; // API 키를 여기에 입력
    const query = `${title} ${type}`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.items[0]?.id.videoId; // 첫 번째 검색 결과의 비디오 ID 반환
  }

  
  useEffect(() => {
    overlap.forEach((ov) => {
      if (ov.title === movie.title) {
        setIsOverlapping(true);
        console.log(ov);
      }
    });
  }, [overlap, movie]);

  

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <h3>{movie.title}</h3>
        {youtubeVideoId && showReview && (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        {!showReview && movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={posterStyle}
          />
        )}
        {/* <p>평점 : {movie.vote_average}</p> */}
        <div>
          <button
            onClick={handleReviewClick}
            value="preview"
            style={{ margin: '10px' }}
          >
            예고편 보기
          </button>
          {!isOverlapping ? (
            <button
              onClick={handleReviewClick}
              value="review"
              style={{ margin: '10px' }}
            >
              리뷰영상 보기
            </button>
          ) : (
            <Link
              to={`/page4?voteAvg=${MoviePost.vote_average}&posterUrl=${MoviePost.posterUrl}&directorName=${MoviePost.director}&releaseDate=${MoviePost.release_date}&genres=${MoviePost.genres}&title=${MoviePost.title}`}
            >
              <button
                onClick={handleReviewClick}
                value="review"
                style={{ margin: '10px' }}
              >
                예매하러 가기
              </button>
            </Link>
          )}
        </div>
        {/* Display the synopsis */}
        {/* {movie.synopsis && (
          <div style={synopsisStyle}>
            <h4>줄거리 :</h4>
            <p>{movie.synopsis}</p>
          </div>
        )} */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
