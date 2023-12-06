import { useState, useEffect } from 'react';
import {
  Container,
  Header,
  Logo,
  Body,
  ImageGroup,
} from './components/Page1Style';
import { Link } from 'react-router-dom';
import ImageChange from './components/Page1/Scroll';
import BoxOffice from './components/Page1/boxoffice';
import PageButton from './components/Share/PageButton';
import Search from './components/Share/Search';
import Login from './components/Share/Login';
import Footer from './components/Share/Footer';
import MoreMovies from './components/Page1/MoreMovies';
import LandingPage from './components/Page1/LandingPage';
import ToTop from './components/Page1/ToTop';
import Member from './components/Share/Member';
import { jwtDecode } from 'jwt-decode';

function Page1() {
  // const [count, setCount] = useState(0)
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
        <PageButton />
        {token ? <Member /> : <Login />}
      </Header>

      <Body>
        <LandingPage />
        <Search />
        <br/>
        <ImageGroup id="scroll">
          <BoxOffice />
        </ImageGroup>
        <ImageChange />
        <MoreMovies />
      </Body>
      <Footer />
      <ToTop />
    </Container>
  );
}

export default Page1;
