import styled from 'styled-components';
import { Link } from 'react-router-dom';


const MemberBox = styled.div`
  display: flex;
  position: relative;
  right: 2vw;
`;

const LoginInfo = styled.div`
  margin: 15px;
  height: 5vh;
  font-family: 'Noto Sans KR', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 1.8vh;
  line-height: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4f3f3;
  white-space: nowrap;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.99); /* 그림자 효과 추가 */
  &:hover {
    color: #f4f3f3;
    text-decoration: underline;
    text-underline-position: under;
    transition: 0.5s;
    cursor: pointer;
  }
`;
const LoginInfo1 = styled.div`
height: 5vh;
white-space: nowrap;
font-family: 'Noto Sans KR', sans-serif;
font-style: normal;
font-weight: 600;
font-size: 1.8vh;
line-height: 19px;
display: flex;
align-items: center;
justify-content: center;
color: #f4f3f3;
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.99); /* 그림자 효과 추가 */
  margin: 15px;
`;

const LoginInfo2 = styled.div`
height: 5vh;
font-family: 'Noto Sans KR', sans-serif;
font-style: normal;
font-weight: 600;
font-size: 1.8vh;
line-height: 19px;
white-space: nowrap;
display: flex;
align-items: center;
justify-content: center;
color: #f4f3f3;
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.99); /* 그림자 효과 추가 */
  margin: 15px 0px;
`;
const StyledButton = styled.button`
  font-family: 'Noto Sans KR', sans-serif;
  line-height: 19px;
  color: #f4f3f3;
  background-color: transparent;
  border: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.99);
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    text-decoration: underline;
  }
`;
function Member() {
  function signOut() {
    // 사용자에게 로그아웃을 확인하는 대화 상자 표시
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");

     if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.reload();
    }
  }

  return (
    <>
      <MemberBox>
        <LoginInfo1>
          {localStorage.username} 님 
        </LoginInfo1>

        <Link to="/record">
          <LoginInfo>내 정보</LoginInfo>
        </Link>

        <Link to="/">
          <LoginInfo2>
            <StyledButton onClick={signOut}>로그아웃</StyledButton>
          </LoginInfo2>
        </Link>
      </MemberBox>
    </>
  );
}

export default Member;
