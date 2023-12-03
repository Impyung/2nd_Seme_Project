import { useState, useEffect, createContext } from 'react';
import {
  Container,
  Header,
  Logo,
  Reservation,
  TheatherGroup,
  Body,
  TextBox,
  StyledButton,
  DropDownOption,
  MapContainer,
  TheaterContainer,
} from './components/Page4Style';
import axios from 'axios';
// import Scroll from './components/Page4/Scroll';
import RecommendedMoviesList from './components/Page4/RecommendedMoviesList';
import Theather from './components/Page4/Theather';
import Date from './components/Page4/Date';
import PageButton from './components/Share/PageButton';
import Login from './components/Share/Login';
import MovieInfo from './components/Page4/MovieInfo';
import { useLocation } from 'react-router-dom';
import KakaoMap from './components/Page4/Location';
import cgv from './components/Page4/TN/cgvTheater.json';
import lotte from './components/Page4/TN/lotte.json';
import megabox from './components/Page4/TN/megabox.json';
// import axios from 'axios';
import Member from './components/Share/Member';
import { jwtDecode } from 'jwt-decode';
import Footer from './components/Share/Footer';
import { Link } from 'react-router-dom';

export const Page4Context = createContext();

function Page4() {
  // 선택한 영화 정보 불러오기
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const posterUrl = params.get('posterUrl');
  const voteAvg = params.get('voteAvg');
  const directorName = params.get('directorName');
  const releaseDate = params.get('releaseDate');
  const genres = params.get('genres');
  const title = params.get('title');

  // 지도 & 영화정보 전환
  const [mapOpen, setMapOpen] = useState(true);
  const [dataOpen, setDataOpen] = useState(false);
  const ShowMovieData = () => {
    setMapOpen(false);
    setDataOpen(true);
  };
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [selection, setSelection] = useState('');

  const getRecommendations = () => {
    axios
      .get(`http://127.0.0.1:5000/RcmAllMovie`)
      .then(async (response) => {
        const title = []
        for (let i = 0; i < 10; i++) {
          if (response.data[i]) {
            title[i] = response.data[i].title
          }
        }
        console.log(title);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  // 드롭다운 선택
  const DropDown = (event) => {
    setSelection(event.target.value);
    // 여기에서 선택된 값을 처리할 수 있습니다.
  };

  // 유저 토큰 받아오기
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode(storedToken);
      setUsername(decodedToken.username);
    }
    getRecommendations()
  }, []);

  // 많은 영화관중 주요 3사 영화관만 선별
  function find3Theaters(theaters) {
    const targetTheaters = ['CGV', '메가박스', '롯데시네마'];
    return theaters.filter((theater) =>
      targetTheaters.some((target) => theater.place_name.includes(target))
    );
  }

  // 근처 영화관 데이터 받아오기
  const [nData, setNData] = useState('');
  const [tData, setTData] = useState();
  const handleDataChange = (newData) => {
    const matchingTheaters = find3Theaters(newData);
    setNData(matchingTheaters);
  };

  function findCGVCode(theaters, place) {
    for (const theater of theaters) {
      if (theater.value.includes(place)) {
        return theater.theatercode;
      }
    }
    return null; 
  }

  function findLOTTECode(theaters, place) {
    for (const theater of theaters) {
      if (theater.value.includes(place)) {
        return theater.cinemaID;
      }
    }
    return null;
  }

  function findMEGABOXCode(theaters, place) {
    for (const theater of theaters) {
      if (theater.value.includes(place)) {
        return theater.brchNo;
      }
    }
    return null; 
  }

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // const data1 = {
    //   title : title,
    //   token : localStorage.getItem('token')
    // }

    // axios
    //   .post('http://43.200.133.130:3000//movieView', data1)
    //   .then((response) => {
    //     // Handle the response here
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     // Handle errors here
    //     console.error('There was an error!', error);
    //   });

    if (dataOpen) {
      let theaterData = [];
      for (var i = 0; i < nData.length; i++) {
        const MD = nData[i].place_name.split(' ');
        const theather = MD[0];
        const place = MD[1];
        const CGV = cgv;
        const LOTTE = lotte;
        const MEGABOX = megabox;
        let code;
        let theaterType;
        if (theather === 'CGV') {
          code = findCGVCode(CGV, place);
          theaterType = 'cgv';
        } else if (theather === '롯데시네마') {
          code = findLOTTECode(LOTTE, place);
          theaterType = 'lotte';
        } else if (theather === '메가박스') {
          code = findMEGABOXCode(MEGABOX, place);
          theaterType = 'megabox';
        }
        if (code && theaterType) {
          theaterData.push({ code, theaterType });
        }
      }
      setTData(theaterData);
    }
  }, [dataOpen, nData]);
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
          {dataOpen && (
            <TheaterContainer>
              <MovieInfo
                posterUrl={posterUrl}
                voteAvg={voteAvg}
                directorName={directorName}
                releaseDate={releaseDate}
                genres={genres}
              />
              <Reservation>
                <Date onDateSelect={setSelectedDate} />
                <DropDownOption onChange={DropDown}>
                  <option value="">정렬기준 선택</option>
                  <option value="time">상영시간순</option>
                  <option value="price">좌석가격순</option>
                  <option value="seats">잔여좌석순</option>
                </DropDownOption>
                <TheatherGroup id="scroll">
                  <Page4Context.Provider value={selection}>
                  <Theather
                    nData={nData}
                    movieName={title}
                    tData={tData}
                    date={selectedDate}
                  />
                  </Page4Context.Provider>
                </TheatherGroup>
                {/* <Scroll /> */}
              </Reservation>
            </TheaterContainer>
          )}

          {mapOpen && (
            <MapContainer>
              <KakaoMap onDataChange={handleDataChange} />
              <TextBox>
                <span>근처 영화관 검색결과입니다.</span>
                <br />
                <span>원하시는 버튼을 눌러주세요.</span>
                <br />
                <StyledButton onClick={ShowMovieData}>
                  실시간 예매 현황
                </StyledButton>
                <br />
                <StyledButton onClick={() => window.location.reload()}>
                  위치 새로고침
                </StyledButton>
                <br />
              </TextBox>
              <RecommendedMoviesList title={title} />
            </MapContainer>
          )}
        </Body>
        <Footer/>
      </Container>
  );
}

export default Page4;
