import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// export const s = styled.div`
//     position: absolute;
// `;

export const Container = styled.div`
  width: 100%; // 너비를 화면의 100%로 설정
  height: 100vh; // 높이를 화면의 100%로 설정
`;


export const Body = styled.div`
  position: relative;
  height: 100vh;
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
background: ${({ isvisible }) => (isvisible ? 'rgba(28, 30, 44, 0)' : 'rgba(28, 30, 44, 0.99)')};
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

export const BoldText = styled.span`
  font-weight: 800;  
  font-size: 24px;  
`;

export const Logo1 = styled.div`
  position: relative;
  width: 15vw;
  margin: 0 auto;
  top: 5vh;
  font-style: normal;
  align-items: center;
  text-align: center;
  // 기타 스타일 유지
`;

export const Welcome = styled.div`
  position: relative;
  width: 20vw;
  top: 7vh;
  margin: 0 auto  ; // 위쪽 여백 조정, 중앙 정렬
  font-family: 'Noto Sans KR';
  font-size: 1.2rem;
  text-align: center;
  color: #FFFFFF;
  margin-bottom: 10vh;
`;

export const IdInput = styled.input`
  position: relative;
  width: 30vw;
  height: 5vh;
  margin: 1vh ; // 여백 조정, 중앙 정렬
  background: transparent;
  border: none;
  border-bottom: 2px solid #fff;
  font-family: 'Noto Sans KR';
  font-size: 1rem;
  color: #FFFFFF;
`;

export const PwInput = styled(IdInput)`
  // IdInput 스타일 상속
`;

export const LoginButton = styled.button`
  position: relative;
  width: 20vw;
  height: 6vh;
  padding: 0.5vh 0; // 버튼 내부 여백을 0.5vh로 설정
  margin: 5vh auto 0; // 여백 조정, 중앙 정렬
  border-radius: 40px;
  font-family: 'Noto Sans KR';
  background: #898FC0;
  color: #FFFFFF;
  font-size: 1.2rem;
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

export const Caption = styled.div`
  position: relative;
  width: 25vw;
  padding: 0.5vh 0;
  margin: 2vh auto 0; // 여백 조정, 중앙 정렬
  font-size: 1rem;
  font-family: 'Noto Sans KR';
  text-align: center;
  color: #FFF;

  a {
    color: #9AB0FF;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const InputGroup = styled.div`
  display: flex; // Flex 컨테이너로 설정
  align-items: center; // 수직 중앙 정렬
  width: 30vw;
  margin: 0 auto; // 수평 중앙 정렬 ;
`;

// FontAwesomeIcon 컴포넌트에 대한 스타일을 추가할 수 있습니다.
export const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 5px; // 아이콘과 입력 필드 사이의 간격
  color: grey; // 아이콘 색상 설정
  font-size: 18px; /* 아이콘 크기 설정 */
`;

export const BodyContainer = styled.div`
position: relative;  
top: 11vh;
`;