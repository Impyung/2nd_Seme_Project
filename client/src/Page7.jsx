import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Header,
  Logo,
  Body,
  RecommendBox,
} from './components/Page7Style'; // 가정한 스타일 컴포넌트 경로
import PageButton from './components/Share/PageButton';
import Login from './components/Share/Login';
import MovieDetailsModal from './components/Page7/MovieDetailsModal';
import SelectedMoviesDisplay from './components/Page7/SelectedMoviesDisplay';
import RecommendationsDisplay from './components/Page7/RecommendationsDisplay';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Footer from './components/Share/Footer';
import Member from './components/Share/Member';

function Page7() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken);
      setUsername(decodedToken.username);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setIsHeaderVisible(position === 0);
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [movieDetails, setMovieDetails] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [tvGenres, setTVGenres] = useState({});
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [isTextVisible, setIsTextVisible] = useState(true);
  // Function to fetch movie details
  const fetchMovieDetails = async (title) => {
    const KEY = '0d38cc635c10e090910f3d7ea7194e05';
    const URL = 'https://api.themoviedb.org/3';

    try {
      const response = await fetch(
        `${URL}/search/movie?api_key=${KEY}&language=ko-KR&page=1&query=${encodeURIComponent(
          title
        )}`
      );
      const data = await response.json();
      const movie = data.results[0];
      return movie
        ? {
            title,
            posterUrl: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            vote_average: movie.vote_average,
            synopsis: movie.overview,
            // ... other details you want to include ...
          }
        : { title, posterUrl: null, vote_average: null };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return { title, posterUrl: null, vote_average: null };
    }
  };

  // Handler for when a movie is selected from the recommendations
  const handleMovieSelection = async (title) => {
    const details = await fetchMovieDetails(title);
    setMovieDetails(details);
    setIsModalVisible(true);
    console.log(details);
  };

  const handleBack = () => {
    setIsTextVisible(true);
  };

  // Declare the state and its setter function

  const handleCloseModal = () => {
    setIsModalVisible(false);
    console.log('Modal should be closed now');
  };

  const [selectedTitle, setSelectedTitle] = useState(null);

  const getRecommendations = (title) => {
    setSelectedTitle(title);
    setIsTextVisible(false);
    axios
      .get(
        `https://43.200.133.130:5000/movies?title=${encodeURIComponent(title)}`
      )
      .then(async (response) => {
        const recommendedTitles = response.data.recommendations;
        const detailedRecommendations = await Promise.all(
          recommendedTitles.map(async (title) => {
            const movieResponse = await fetch(
              `https://api.themoviedb.org/3/search/movie?api_key=0d38cc635c10e090910f3d7ea7194e05&language=ko-KR&query=${encodeURIComponent(
                title
              )}`
            );
            const movieData = await movieResponse.json();
            return movieData.results[0]; // Assuming the first result is the correct movie
          })
        );
        setRecommendations(detailedRecommendations);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  useEffect(() => {
    // Retrieve selected movies from local storage
    const storedMovies = localStorage.getItem('selectedMovies');
    if (storedMovies) {
      setSelectedMovies(JSON.parse(storedMovies));
    }
  }, []);

  useEffect(() => {
    // Fetch TV show genre data from the API when the component mounts
    const apiKey = 'c4e59022826dc465ea5620d6adaa6813';
    const tvGenreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ko`;

    fetch(tvGenreUrl)
      .then((response) => response.json())
      .then((data) => {
        setTVGenres(
          data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {})
        );
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // 여기서 API 호출을 수행하고 추천 영화 목록을 가져옵니다.
    // 사용자가 선택한 영화 목록을 기반으로 추천을 받을 수 있도록 API 호출에 필요한 정보를 전달합니다.
    const apiKey = 'c4e59022826dc465ea5620d6adaa6813';
    const selectedMovieIds = selectedMovies.map((movie) => movie.id).join(',');
    const recommendedMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedMovieIds}&language=ko-KR`;
    fetch(recommendedMoviesUrl)
      .then((response) => response.json())
      .then((data) => {
        // 추천된 영화 목록을 상태에 저장합니다.
        setRecommendedMovies(data.results);
      })
      .catch((error) => console.error(error));
  }, [selectedMovies]);

  return (
    <Container>
      <Header isvisible={isHeaderVisible}>
        <Logo>
          <Link to="/">
            <img
              src="/logo2.png"
              alt="Logo"
              style={{ width: '100%', height: '100%' }}
            />
          </Link>
        </Logo>
        <PageButton />
        {token ? <Member /> : <Login />}
      </Header>
      <Body>
        <RecommendBox>
          <h2
            style={{
              padding: '1rem',
              textAlign: 'center',
              color: '#FFF',
              margin: '0',
            }}
          >
            영화를 선택해주세요!
          </h2>
          <SelectedMoviesDisplay
            selectedMovies={selectedMovies}
            getRecommendations={getRecommendations}
          />
          <br />

          {selectedTitle && (
            <>
              <hr style={{ width: '80%' }} />
              <h2
                style={{
                  paddingTop: '10vh',
                  textAlign: 'center',
                  color: '#FFF',
                  margin: '0',
                }}
              >
                "{selectedTitle && selectedTitle}" 관련 영화
              </h2>
            </>
          )}
          {selectedTitle && (
            <h3
              style={{
                paddingTop: '1rem',
                textAlign: 'center',
                color: '#d4d4d4',
                margin: '0',
              }}
            >
              영화 제목을 클릭하시면 정보를 볼 수 있습니다
            </h3>
          )}
          <RecommendationsDisplay
            id="RcmdDP"
            recommendations={recommendations}
            onMovieSelect={handleMovieSelection}
          />
          {isModalVisible && (
            <MovieDetailsModal
              movie={movieDetails}
              onClose={handleCloseModal}
            />
          )}
        </RecommendBox>
      </Body>
      {/* <Footer/> */}
    </Container>
  );
}

export default Page7;
