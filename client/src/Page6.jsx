import { useState, useEffect } from 'react';
import { Container, Header, Logo, Body } from './components/Page6Style';
import PageButton from './components/Share/PageButton';
import Login from './components/Share/Login';
import Search from './components/Share/Search';
import Movie from './components/Page6/MovieDB';
import {
  ResultContainer,
  ResultGroup,
  SearchText,
  MovieItem,
} from './components/Page6Style';
// import Page6Scroll from './components/Page6/Scroll';
import { useLocation } from 'react-router-dom';
import Member from './components/Share/Member';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import Footer from './components/Share/Footer';
import { Grid } from 'react-loader-spinner';
import styled from 'styled-components';
import MovieModal from './components/Page6/MovieModal';
import ToTop from './components/Page1/ToTop';
function Page6() {
  // const [count, setCount] = useState(0)

  const KEY = '0d38cc635c10e090910f3d7ea7194e05';
  const URL = 'https://api.themoviedb.org/3/search/movie';
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [NAME, setNAME] = useState('');
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

  const getMovies = async (searchName) => {
    // searchName 파라미터 추가
    const json = await (
      await fetch(
        `${URL}?api_key=${KEY}&language=ko-KR&page=1&query=${searchName}`
      )
    ).json();
    // 포스터 이미지가 있는 영화만 필터링
    const filteredMovies = json.results.filter(movie => movie.poster_path);
    setMovies(filteredMovies);
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery) {
      setNAME(searchQuery);
      getMovies(searchQuery); // 직접 검색어 전달
    }
  }, [searchQuery]);

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

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
  const GridContainer = styled.div`
  display: flex; /* Flexbox 사용 */
  justify-content: space-between;
`;
  const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  `;

const NoResultsContainer = styled.div`
${fadeInAnimation}
animation: fadeIn 1s ease-in-out;
text-align: center;
height: 60vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`;
const [selectedMovie, setSelectedMovie] = useState(null);
const onSelectMovie = (movie) => {
  setSelectedMovie(movie);
};

// 이미지와 텍스트 스타일은 그대로 유지합니다.

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
        <Search />
        {NAME ? <SearchText> "{NAME}"의 검색결과 입니다</SearchText> : ''}
        <ResultContainer id="page6scroll">
          {loading ? (
            <GridContainer>
            <Grid color="#2f5792" height={350} width={200} />
            <Grid color="#2f5792" height={350} width={200} />
            <Grid color="#2f5792" height={350} width={200} />
            <Grid color="#2f5792" height={350} width={200} />
            <Grid color="#2f5792" height={350} width={200} />
          </GridContainer>
          ) : movies.length === 0 ? (
            <NoResultsContainer>
            <img src="/nojobsfound.png" alt="No results" style={{ maxWidth: '600px', marginBottom: '0px' }} />
            <p style={{ color: '#FFF', fontSize: '1.2rem', fontFamily: 'Noto Sans KR' }}>
              검색 결과가 없습니다
              <br />다른 검색어를 입력해보세요
            </p>
          </NoResultsContainer>
          ) : (
            <ResultGroup>
              {movies.map((movie) => (
                <MovieItem key={movie.id}>
                <Movie
                  poster_path={movie.poster_path}
                  title={movie.title}
                  overview={movie.overview}
                  genre_ids={movie.genre_ids}
                  onSelectMovie={onSelectMovie}
                />
              </MovieItem>
              ))}{' '}
            </ResultGroup>
          )}
          {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}

        </ResultContainer>
        {/* {NAME ? <Page6Scroll /> : null} */}
      </Body>
      <ToTop />
      <Footer/>
    </Container>
  );
}

export default Page6;
