import styled from "styled-components";

export const Container = styled.div`
  width: 100%; // 너비를 화면의 100%로 설정
  height: 100vh; // 높이를 화면의 100%로 설정
`;


export const Body = styled.div`
  position: relative;
  color: #f4f3f3;
  background: linear-gradient(0deg, #2A2F42 30%, #1C1E2C 70%); // Adjust the gradient direction and color stops
`;

export const Header = styled.div`
position: fixed;
justify-content: space-between;
display: flex;
width: 100%;
min-width: 500px;
height: 11vh;
left: 0px;
top: 0;
z-index: 999;
background: ${({ isvisible }) => (isvisible ? 'rgba(28, 30, 44, 1)' : 'rgba(28, 30, 44, 0.5)')};
 transition: background 0.5s ease; /* 배경 전환에 애니메이션 추가 */
`;


export const Logo = styled.div`
  position: relative;
  left: 5vw;
  top: 1vh;
  width: 13.5vh; // Start with a base size
  height: 9.5vh; // Maintain aspect ratio
  /* left: 6vw; */
  transition: transform 0.5s ease-in-out;
  &:hover {
    transform: scale(1.1); /* 마우스 호버 시 1.1배 확대 효과 */
    cursor: pointer;
  }

  // Adjustments for smaller screens
  @media (max-width: 768px) {
    width: 16vw; // Larger percentage on smaller screens
    height: 11vh; // Maintain aspect ratio
  }

  // Adjustments for very small screens
  @media (max-width: 480px) {
    width: 12vw; // Even larger percentage on very small screens
    height: 11vh; // Maintain aspect ratio
  }
`;


export const FormContainer = styled.div`
  margin-top: 10vh; /* 폼 상단 여백 */
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #fff; /* 글자색 조정 */
  font-family: 'Noto Sans KR';
`;

export const FormTitle = styled.h2`
  margin-bottom: 10vh; /* 제목 아래 간격 */
  font-family: 'Noto Sans KR';
`;

export const Label = styled.label`
  align-self: flex-start;
  margin-left: 34%; /* 레이블의 왼쪽 마진 */
  margin-bottom: 5px; /* 입력 필드 위 간격 */
  font-family: 'Noto Sans KR';
  font-size: 12px;
`;

export const StyledInput = styled.input`
  width: 30vw; /* 폼 너비에 맞춤 */
  height: 6vh; /* 입력 필드 높이 */
  margin-bottom: 5vh; /* 입력 필드 간격 */
  border-radius: 5px; /* 모서리 둥글기 */
  background: #D9D9D9;/* 입력 필드 배경색 */
  font-size: 16px; /* 글꼴 크기 */
  font-family: 'Notosans KR';
  color: black; /* 글자색 */
  text-indent: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const StyledInput2 = styled.input`
  width: 30vw; /* 폼 너비에 맞춤 */
  flex-grow: 1; // 입력란이 가능한 많은 공간을 차지하도록 설정
  height: 6vh; /* 입력 필드 높이 */
  margin-bottom: 3vh; /* 입력 필드 간격 */
  border-radius: 5px; /* 모서리 둥글기 */
  background: #D9D9D9;/* 입력 필드 배경색 */
  font-size: 16px; /* 글꼴 크기 */
  font-family: 'Notosans KR';
  color: black; /* 글자색 */
  text-indent: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const SubmitButton = styled.button`
  width: 30vw; /* 버튼 너비 */
  padding: 0 15px; /* 버튼 여백 */
  height: 52px; /* 버튼 높이 */
  margin-top: 50px; /* 버튼 위 간격 */
  border-radius: 5px; /* 모서리 둥글기 */
  background: #898FC0;
  color: #fff; /* 버튼 글자색 */
  border: none; /* 테두리 없음 */
  font-size: 20px; /* 글꼴 크기 */
  cursor: pointer; /* 마우스 오버시 커서 변경 */
  font-family: 'Noto Sans KR';
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;
  &:hover {
    background: #4F526B;
    transform: translateY(+2px); // 클릭 유도를 위한 애니메이션 효과
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;

export const SignInLink = styled.p`
margin-top: 20px;
color: #9AB0FF;
text-align: center;
font-size: 18px;
font-family: 'Noto Sans KR';
a {
  color: #9AB0FF; // <Link> 컴포넌트에 적용될 색상
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
`;

export const Caption = styled(SignInLink)` // Caption을 SignInLink와 같은 스타일로 정의
color: #FFFFFF;
font-family: 'Noto Sans KR';  
font-style: normal;
`;


export const AssignComplete = styled.div`
  position: absolute;
  width: 736px;
  height: 87px;
  left: 372px;
  top: 307px;

  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 60px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #FFFFFF;
`;

export const TextOfLogin = styled.div`
  position: absolute;
  width: 902px;
  height: 65px;
  left: 310px;
  top: 394px;

  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 30px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #FFFFFF;
`;
export const LoginButton = styled.button`
  position: absolute;
  width: 200px;
  height: 50px;
  left: 522px;
  top: 483px;
  font-size: 29px;
  background: #898FC0;
  border-radius: 10px;
  line-height: 15px;
  font-family: 'Noto Sans KR';
`;

export const CheckLogo = styled.div`
.logo{
  position: absolute;
  top: -230px;
  left: 420px;
  font-size: 100px;
}
`;


// export const AssignComplete = styled.div`
  
// `;
// export const AssignComplete = styled.div`
  
// `;

export const InputWithButton = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3vh;
  width: 30vw; // 폼 너비에 맞춤
  gap: 1vw; // 입력 필드와 버튼 사이의 간격
  button {
    flex-shrink: 0; // 버튼의 크기가 축소되지 않도록 설정
  }
`;


