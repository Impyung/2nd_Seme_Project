import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import axios from 'axios';
dayjs.locale('ko');
import { Grid } from 'react-loader-spinner';

const ImageInfo = styled.div`
  position: absolute;
  width: 194px;
  height: 285px;
  background: #d9d9d9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  overflow: hidden; /* Ensure the image doesn't overflow the div */
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%; /* Adjust the height of the image portion */
  object-fit: cover; /* Maintain aspect ratio and cover the div */
`;

const GradeInfo = styled.div`
  position: absolute;
  width: 65px;
  height: 27px;
  background: #1c1e2c;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: ${(props) => {
    if (props.rating == 0) {
      return '17px';
    } else {
      return '20px';
    }
  }};
  display: flex;
  justify-content: center;
  line-height: 30px;
  color: ${(props) => {
    if (props.rating >= 8.5) {
      return '#4D96FF';
    } else if (props.rating >= 7.5) {
      return '#6BCB77';
    } else if (props.rating >= 6.5) {
      return '#FFD93D';
    } else {
      return '#FF6B6B';
    }
  }};
`;

const ReservInfo = styled.button`
  position: absolute;
  width: 119px;
  height: 27px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: #898fc0;
  color: black;
  font-family: 'Noto Sans KR', sans-serif;
  font-style: normal;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover {
    background: #4f526b;
    transform: translateY(+2px); // 클릭 유도를 위한 애니메이션 효과
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;
const Rank = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  color: #f3f3f3;
  font-weight: bold;
  font-size: 42px;
  // background-color: #898FC0;
  font-family: 'Inter';
  padding: 0px 4px;
  border-radius: 10 0 0 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.99);
  z-index: 1; /* 포스터 이미지 위로 나타나도록 설정 */
`;

const GridContainer = styled.div`
  display: flex; /* Flexbox 사용 */
  justify-content: space-between;
`;

function BoxOffice() {
  const [movieData, setMovieData] = useState([]);
  const [moviePost, setMoviePost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(
    dayjs().subtract(1, 'day').format('YYYYMMDD')
  );

  const getMovies = async () => {
    // searchName 파라미터 추가
    const koficResponse = await (
      await fetch(
        `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=c41addc3237a2809a6569efc778d609e&targetDt=${currentDate}`
      )
    ).json();
    const boxOfficeData = koficResponse.boxOfficeResult.dailyBoxOfficeList;
    const filteredMovies = boxOfficeData.filter(movie => movie.movieNm !== '괴물'); // '괴물' 영화 제외
    const movieTitles = filteredMovies.map(movie => movie.movieNm);
    setMovieData(movieTitles);
  };

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
    const moviesWithPoster = tmdbJson.results.filter(movie => movie.poster_path);

    if (moviesWithPoster.length > 0) {
      const movie = moviesWithPoster[0]; // Taking the first movie that has a poster
      // Fetch additional movie details by movie ID
      const movieDetailsResponse = await fetch(`${URL}/movie/${movie.id}?api_key=${KEY}&language=ko-KR&append_to_response=credits`);
      const movieDetailsJson = await movieDetailsResponse.json();
      const director = movieDetailsJson.credits.crew.find((person) => person.job === 'Director');
      const genres = movieDetailsJson.genres.slice(0, 2).map((genre) => genre.name);

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
  return (await Promise.all(promises)).filter(movie => movie !== null);
};
  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    if (movieData.length > 0) {
      getPost(movieData)
        .then(setMoviePost)
        .finally(() => setIsLoading(false));
    }
  }, [movieData]);

  const ImageData = () => {};

  const GradeData = () => {};

  const ReservData = async (movieTitle) => {
    alert(`예매하기: "${movieTitle}"`);
    try {
      const selectedTitle = movieTitle;

      console.log('title', selectedTitle);

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      // 기존 로컬 서버로의 요청
    const localServerResponse = await axios.post(
      'http://localhost:3000/movieView',
      { title: selectedTitle },
      { headers }
    );
    console.log(localServerResponse.data);

     // Flask 서버로의 요청
    const flaskServerResponse = await axios.get(
      `http://localhost:5000/movies?title=${encodeURIComponent(selectedTitle)}`
    );
    console.log(flaskServerResponse.data);

      
    } catch (error) {
      console.log('Error in ReservData:', error);
    }
  };

  return (
    <>
      {isLoading ? (
        <GridContainer>
          <Grid color="#2f5792" height={350} width={200} />
          <Grid color="#2f5792" height={350} width={200} />
          <Grid color="#2f5792" height={350} width={200} />
          <Grid color="#2f5792" height={350} width={200} />
          <Grid color="#2f5792" height={350} width={200} />
        </GridContainer>
      ) : (
        moviePost.map((movie, index) => (
          <ImageInfo
            key={index}
            style={{ left: `${index * 291}px`, top: '0px' }}
            onClick={ImageData}
          >
            <PosterImage src={movie.posterUrl} alt={movie.title} />
            <Rank>{index + 1}</Rank>
          </ImageInfo>
        ))
      )}

      {moviePost.map((movie, index) => (
        <GradeInfo
          key={index}
          style={{ left: `${index * 291}px`, top: '295px' }}
          onClick={GradeData}
          rating={movie.vote_average} // Pass the rating as a prop
        >
          {movie.vote_average === 0 ? '합산중' : movie.vote_average?.toFixed(1)}
          {/* {movie.vote_average} */}
        </GradeInfo>
      ))}

      {moviePost.map((movie, index) => (
        <Link
          key={index}
          to={`/page4?voteAvg=${movie.vote_average}&posterUrl=${movie.posterUrl}&directorName=${movie.director}&releaseDate=${movie.release_date}&genres=${movie.genres}&title=${movie.title}`}
        >
          <ReservInfo
            style={{ left: `${index * 291 + 75}px`, top: '295px' }}
            onClick={() => ReservData(movie.title)}
          >
            예매
          </ReservInfo>
        </Link>
      ))}
    </>
  );
}

export default BoxOffice;
