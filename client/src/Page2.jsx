import { useState, useEffect } from 'react';
import { Container, Header, Logo, Body, RcmdContainer } from './components/Page2Style';
import { Link } from 'react-router-dom';
import Rcmd from './components/Page2/Rcmd';
import PageButton from './components/Share/PageButton';
import Search from './components/Share/Search';
import Login from './components/Share/Login';
import Footer from './components/Share/Footer';
import ToTop from './components/Page1/ToTop';
import Chart from './components/Page2/Chart';
import Member from './components/Share/Member';
import { Colors } from 'chart.js';
import { jwtDecode } from 'jwt-decode';

function Page2() {
  const [selectedGenre, setSelectedGenre] = useState(''); // 초기값 설정
  const [responseData, setResponseData] = useState(null);
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
        <PageButton setResponseData={setResponseData} />
        {token ? <Member /> : <Login />}
      </Header>

      <Body>
        <RcmdContainer>
        <Search />
        <Chart
          setSelectedGenre={setSelectedGenre}
          selectedGenre={selectedGenre}
          responseData={responseData}
        />
        <Rcmd selectedGenre={selectedGenre} />
        </RcmdContainer>
      </Body>
      <Footer />
      <ToTop />
    </Container>
  );
}

export default Page2;
