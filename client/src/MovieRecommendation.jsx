import { useState } from 'react';
import axios from 'axios';

function MovieRecommendation() {
  const [movieTitle, setMovieTitle] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const getRecommendations = (title) => {
    // Flask 서버로 GET 요청을 보냅니다.
    axios
      .get(
        `https://43.200.133.130:5000/movies?title=${encodeURIComponent(title)}`
      )
      .then((response) => {
        // 성공적으로 데이터를 받으면 상태를 업데이트합니다.
        console.log(response.data); // 응답 데이터 확인
        const recommendedMovies = response.data.recommendations;
        setRecommendations(recommendedMovies);
      })
      .catch((error) => {
        // 에러가 발생하면 콘솔에 로그를 출력합니다.
        console.error('There was an error!', error);
      });
  };

  return (
    <div>
      <h1>Movie Recommendations</h1>
      <input
        type="text"
        value={movieTitle}
        onChange={(e) => setMovieTitle(e.target.value)}
        placeholder="Enter movie title"
      />
      <button onClick={() => getRecommendations(movieTitle)}>
        Get Recommendations
      </button>
      <ul>
        {recommendations.map((movie, index) => (
          <li key={index}>{movie}</li>
        ))}
      </ul>
    </div>
  );
}

export default MovieRecommendation;
