import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Logo, Body, GridContainer } from './components/Page5Style';
import Login from './components/Share/Login';
import PageButton from './components/Share/PageButton';
import {
  Text1,
  Submit,
  ScrollContent,
  SubmitBox,
  SubmitContent,
  SubmitContainer,
  TopSection,
  StyledRefreshIcon,
} from './components/Page5Style';
import BoxChange from './components/Page5/BoxChange';
import Footer from './components/Share/Footer';
import Search from './components/Share/Search';
import ToTop from './components/Page1/ToTop';
import Member from './components/Share/Member';
import { jwtDecode } from 'jwt-decode';
import { Grid } from 'react-loader-spinner';

// import MovieFetcher from './components/Page5/MovieFetcher';
// import MovieSelector from './components/Page5/MovieSelector';

function Page5() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  const scrollableContentRef = useRef(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1); // 페이지 번호를 상태로 관리
  const fetchMovies = (pageNumber) => {
    const apiKey = 'c4e59022826dc465ea5620d6adaa6813';
    const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko&page=${pageNumber}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const firstNineMovies = data.results.slice(6, 15, 2);
        setMovies(firstNineMovies);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchMovies(page);
  }, []);

  const handleNextPage = () => {
    let nextPage;
    if (page < 10) {
      // 현재 페이지가 10 미만이면 다음 페이지로 이동
      nextPage = page + 1;
    } else {
      // 현재 페이지가 10이면 다시 1로 리셋
      alert('처음 목록으로 돌아갑니다.');
      nextPage = 1;
    }
    setPage(nextPage); // 페이지 번호 업데이트
    fetchMovies(nextPage); // 해당 페이지의 영화 불러오기
  };

  const submitBoxRef = useRef(null);
  const handleBoxClick = (movie) => {
    // Check if the movie is not already in selectedMovies
    if (
      selectedMovies.length < 3 &&
      !selectedMovies.some((m) => m.id === movie.id)
    ) {
      setSelectedMovies([...selectedMovies, movie]);
    } else if (selectedMovies.some((m) => m.id === movie.id)) {
      alert('이미 선택된 영화입니다.');
    } else {
      alert('최대 세 개 영화까지만 선택 가능합니다.');
    }
    if (
      selectedMovies.length === 2 &&
      !selectedMovies.some((m) => m.id === movie.id)
    ) {
      // 새 영화를 선택 목록에 추가
      setSelectedMovies([...selectedMovies, movie]);

      // SubmitBox로 스크롤
      if (submitBoxRef.current) {
        submitBoxRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));

  const handleDeleteBox = (movie) => {
    const shouldDelete = window.confirm(
      `"${movie.title}" 영화를 삭제하시겠습니까?`
    );
    if (shouldDelete) {
      setSelectedMovies(selectedMovies.filter((m) => m.id !== movie.id));
    }
  };

  const handleSubmit = () => {
    if (selectedMovies.length === 3) {
      window.scrollTo({
        top: 0, // Scroll to the top of the page
        behavior: 'smooth', // Optional: for smooth scrolling
      });
    } else {
      alert('최소 세 개의 영화를 선택해야 합니다.');
    }
  };

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
        <TopSection>
          <Text1>본인의 취향에 맞는 영화를 3개 골라주세요!
          <StyledRefreshIcon style={{display:'relative', marginLeft:'20px'}} onClick={handleNextPage} />
          </Text1>
        </TopSection>

        {isLoading && 
        <GridContainer>
                    <Grid color="#2f5792" height={450} width={170} />
                    <Grid color="#2f5792" height={450} width={170} />
                    <Grid color="#2f5792" height={450} width={170} />
                    <Grid color="#2f5792" height={450} width={170} />
                    <Grid color="#2f5792" height={450} width={170} />
                  </GridContainer>}
        <ScrollContent id="scroll" ref={scrollableContentRef}>
          {!isLoading&&movies.map((movie) => (
            <div key={movie.id}>
              <div onClick={() => handleBoxClick(movie)}>
                <img
                  src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} // Use the poster_path from the API response
                  alt={movie.title}
                  style={{
                    borderRadius: '5px',
                    maxWidth: '300px',
                    maxHeight: '300px',
                  }}
                />
              </div>
            </div>
          ))}
        </ScrollContent>
        <BoxChange />
        <SubmitContainer>
          <SubmitBox ref={submitBoxRef}>
            {selectedMovies.map((selectedMovie) => (
              <SubmitContent
                key={selectedMovie.id}
                onClick={() => handleDeleteBox(selectedMovie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w185${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </SubmitContent>
            ))}
          </SubmitBox>

          {selectedMovies.length === 3 ? (
            <Link to="/page7" onClick={handleSubmit}>
              <Submit>제출하기</Submit>
            </Link>
          ) : (
            <Submit onClick={handleSubmit}>제출하기</Submit>
          )}
        </SubmitContainer>
      </Body>
      <Footer />
      <ToTop />
    </Container>
  );
}

export default Page5;
