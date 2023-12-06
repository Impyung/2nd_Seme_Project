import { useState, useEffect } from 'react';
import { Container, Header, Logo, Body } from './components/Page1Style';
import { Link } from 'react-router-dom';
import PageButton from './components/Share/PageButton';
import Login from './components/Share/Login';
import Member from './components/Share/Member';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Footer from './components/Share/Footer';
import ToTop from './components/Page1/ToTop';
import styled from 'styled-components';
import RecommendationsDisplay from './components/Mypage/RecommendationsDisplay';
import MovieDetailsModal from './components/Mypage/MovieDetailsModal';

const RecordsContainer = styled.div`
  margin-top: 17vh;
  height: 75vh;
  width: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    height: 12px; // 스크롤바 높이 조정
    background-color: #2c3440;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4f5b93; // 스크롤바 색상 조정
    border-radius: 10px;
    border: 2px solid #2c3440;
    &:hover {
      background-color: #6d7ba4; // 호버 색상 변경
    }
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #3c4452; // 트랙 내부에 그림자 효과 적용
    border-radius: 10px;
  }

  scrollbar-width: thin;
  scrollbar-color: #4f5b93 #2c3440;
`;

const RecordCard = styled.div`
  width: 210px;
  display: flex;
  text-align: left;
  margin-top: 35px;
  margin-left: 3vw;
`;

const RecordImage = styled.img`
  width: 150px;
  height: 225px;
  border-radius: 10px;
  margin-left: 20px;
`;

const RecordBox = styled.div`
  margin-left: 20px;
  white-space: nowrap;
`;

const RecordTitle = styled.span`
  // Add any specific styles for record title
`;

const RecordTime = styled.span`
  // Add any specific styles for record title
`;

const RecordTheather = styled.span`
  // Add any specific styles for record title
`;

const RatingButton = styled.button`
  margin-top: 5px;
  font-size: 1rem;
  width: 100px;
  height: 40px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background: #1c1e2c;
  color: #f4f3f3;
  font-family: 'Noto Sans KR', sans-serif;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #1c1e2c;
    transform: translateY(-2px); // Slight lift on hover
  }

  &:active {
    transform: translateY(1px); // Depress button on click
  }
`;

const RatingInputContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-radius: 10px;
  width: 150px;
`;

const RatingInput = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  border-radius: 10px;
  margin-top: 10px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #3f79af;
    cursor: pointer;
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #4caf50;
    cursor: pointer;
    border-radius: 50%;
  }
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  font-size: 1rem;
  width: 100px;
  height: 40px;
  padding: 5px;
  border: none;
  border-radius: 5px;
  background: #1c1e2c;
  color: #f4f3f3;
  font-family: 'Noto Sans KR', sans-serif;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #1c1e2c;
    transform: translateY(-2px); // Slight lift on hover
  }

  &:active {
    transform: translateY(1px); // Depress button on click
  }
`;

const RcmdText = styled.h2``;

const RcmdText2 = styled.h3`
  color: rgb(212, 212, 212);
`;

const RecommendationsContainer = styled.div`
  margin-top: 17vh;
  height: 75vh;
  width: calc(100vw - 300px);
  overflow-x: auto;
  overflow-y: hidden;
  text-align: center;
`;

function Page8() {
  const [records, setRecords] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const BASE_IMG_URL = 'https://image.tmdb.org/t/p/w500/';
  const [rating, setRating] = useState('');
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);

  const getRecommendations = () => {
    axios
      .get(`http://127.0.0.1:5000/RcmAllMovie`)
      .then(async (response) => {
        setRecommendations(response.data);
        console.log(recommendations);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };


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

  const handleMovieSelection = async (title) => {
    const details = await fetchMovieDetails(title);
    setMovieDetails(details);
    setIsModalVisible(true);
    console.log(details);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    console.log('Modal should be closed now');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken);
      setUsername(decodedToken.username);
    }
    getRecommendations();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          window.location.href = '/login';
          return;
        }

        const headers = {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        };

        const response = await axios.get('http://localhost:3000/userRecord', {
          headers,
        });

        setRecords(response.data);
      } catch (error) {
        console.error('시청 기록을 가져오는 중 오류 발생:', error);
      }
    };

    fetchRecords();
  }, []);

  const openRatingInput = (movie) => {
    setSelectedMovie(movie);
    setShowRatingInput(true);
  };

  const submitRating = () => {
    try {
      const payload = {
        title: selectedMovie.title,
        rating: rating,
      };

      console.log(payload.title,payload.rating);

      axios.post('http://localhost:3000/rating', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // 평점 입력창 숨기기
      setShowRatingInput(false);
      // 추가적인 상태 업데이트나 UI 반영 로직 (예: 평점 목록 업데이트)
    } catch (error) {
      console.error('평점 제출 중 오류 발생:', error);
      setShowRatingInput(false);
    }
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // 날짜 형식 옵션
    return new Intl.DateTimeFormat('ko-KR', options).format(
      new Date(dateString)
    );
  }

  return (
    <Container>
      <Header>
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
        <div style={{ height: '100vh', display: 'flex' }}>
          <RecordsContainer>
            <RcmdText>관람기록</RcmdText>
            <RcmdText2>평점 입력은 추천 영화 서비스에 반영됩니다.</RcmdText2>
            <hr style={{ width: '80%' }} />
            {records.map((record) => (
              <RecordCard key={record.title}>
                <RecordImage
                  src={BASE_IMG_URL + record.poster_path}
                  alt="Movie Poster"
                />
                <RecordBox>
                  <RecordTitle>제목 : {record.title}</RecordTitle>
                  <br />
                  <br />
                  <RecordTime>
                    관람일 : {formatDate(record.viewDate)}
                  </RecordTime>
                  <br />
                  {/* <RecordTheather>관람극장 : CGV명동</RecordTheather> */}
                  <br />
                  {!showRatingInput && (
                    <RatingButton onClick={() => openRatingInput(record)}>
                      평점입력
                    </RatingButton>
                  )}
                  {showRatingInput && selectedMovie === record && (
                    <RatingInputContainer>
                      평점 : {rating}
                      <RatingInput
                        type="range"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="0"
                        max="10"
                      />
                      <SubmitButton onClick={submitRating}>
                        제출하기
                      </SubmitButton>
                    </RatingInputContainer>
                  )}
                </RecordBox>
              </RecordCard>
            ))}
          </RecordsContainer>

          <RecommendationsContainer>
            <RcmdText>
              {localStorage.getItem('username')
                ? localStorage.getItem('username') + '님 추천 영화'
                : '추천 영화'}
            </RcmdText>
            <RcmdText2>영화 제목을 클릭하시면 정보를 볼 수 있습니다</RcmdText2>
            <hr style={{ width: '80%' }} />
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
          </RecommendationsContainer>
        </div>
      </Body>
      <Footer />
      <ToTop />
    </Container>
  );
}

export default Page8;
