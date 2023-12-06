import styled from "styled-components";
import { Link } from 'react-router-dom';

const LoginInfo = styled.div`
  /* position: fixed; */
  height: 5vh;
  font-family: 'Noto Sans KR', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 1.8vh;
  line-height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4f3f3;
  margin: 15px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.99); /* 그림자 효과 추가 */
  &:hover {
    color: #f4f3f3;
    text-decoration: underline;
    text-underline-position: under;
    transition: 0.5s;
  }
`;

const LoginBox = styled.div`
  display: flex;
`;



function Login() {

    // const Data = () => {
        
    // }


    return(
<>
      <LoginBox>
        <Link to="/Login"><LoginInfo style={{left:'80vw',top:'1vh'}}>로그인</LoginInfo></Link>
        <Link to="/signup"><LoginInfo style={{left:'85vw',top:'1vh'}}>회원가입</LoginInfo></Link>
      </LoginBox>
  </>
    )
}

export default Login;