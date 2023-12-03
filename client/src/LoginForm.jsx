// LoginForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  Logo,
  Body,
  FormContainer,
  FormTitle,
  Label,
  StyledInput,
  StyledInput2,
  SubmitButton,
  Caption,
  InputWithButton,
} from './components/LoginFormStyle';
// FontAwesome 및 기타 필요한 컴포넌트 import
import PageButton from './components/Share/PageButton';
import Login from './components/Share/Login';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './components/Share/Footer';

function LoginForm() {
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

  const navigate = useNavigate();
  // State hooks for each form field
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [verificationCode, setVerificationCode] = useState('');

  const [verNum, setVerNum] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = { username, email, password, verificationCode };
    // 서버에서 구동할때는 주소 바꿔야 합니다
    await axios
      .post('http://localhost:3000/signup', userData)
      .then((response) => {
        console.log('회원가입 성공:', response.data);
        navigate('/Login');
        // 성공적인 회원가입 후 처리
      })
      .catch((error) => {
        console.error('회원가입 오류:', error);
        // 오류 처리
      });
  };

  const handleSendVerificationCode = async () => {
    try {
      const response = await axios.post('http://localhost:3000/verification', {
        email,
      });
      console.log('인증번호가 전송되었습니다.');
      // 인증번호 전송 후 처리
    } catch (error) {
      console.error('인증번호 전송 오류:', error);
      // 오류 처리
    }
  };

  const handleVerificationCodeCheck = async () => {
    try {
      await axios.post('http://localhost:3000/verificationCheck', {
        verNum: verificationCode,
      });

      console.log('인증번호 확인 성공');
    } catch (error) {
      console.error('인증번호 확인 오류:', error);
    }
  };
  const buttonStyle = {
    height: '6vh', // 높이
    borderRadius: '5px',
    background: '#898FC0',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    fontFamily: "'Noto Sans KR'",
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    transition: 'all 0.2s ease'
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
        <Login />
      </Header>

      <Body>
        <form onSubmit={handleSubmit}>
          <FormContainer>
            <FormTitle>회원 가입</FormTitle>

            <Label htmlFor="username">아이디 *</Label>
            <StyledInput
              id="username"
              type="text"
              placeholder="아이디를 입력해주세요."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Label htmlFor="email">이메일 *</Label>
            <InputWithButton>
              <StyledInput2
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
               <button type="button" style={buttonStyle} onClick={handleSendVerificationCode}>
          인증번호 받기
        </button>
            </InputWithButton>
            <Label htmlFor="password">비밀번호 *</Label>
            <StyledInput
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Label htmlFor="verificationCode">인증 코드 *</Label>
            <InputWithButton>
              <StyledInput2
                id="verificationCode"
                type="text"
                placeholder="이메일로 받은 인증 번호를 입력해주세요."
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <button type="button" style={buttonStyle} onClick={handleVerificationCodeCheck}>
          인증번호 확인
        </button>
            </InputWithButton>
            {/* <button type="button" onClick={handleSendVerificationCode}>
              인증번호 받기
            </button>

            <button type="button" onClick={handleVerificationCodeCheck}>
              인증번호 확인
            </button> */}

            <SubmitButton type="submit">가입하기</SubmitButton>

            {/* 
          <Label htmlFor="passwordConfirm">비밀번호 확인 *</Label>
          <StyledInput
            id="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인을 입력해주세요."
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          /> */}

            <Caption>
              계정이 있으신가요? | <Link to="/login">로그인</Link>
            </Caption>
          </FormContainer>
        </form>
      </Body>
      <Footer />
    </Container>
  );
}
export default LoginForm;
