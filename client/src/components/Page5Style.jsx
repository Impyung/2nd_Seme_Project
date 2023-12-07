import styled from "styled-components";
import { MdRefresh } from 'react-icons/md';

// export const s = styled.div`
//     position: absolute;
// `;

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between; // 헤더와 푸터 사이의 공간을 균등하게 분배
  background: linear-gradient(0deg, #2A2F42 30%, #1C1E2C 70%);
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

export const ScrollContent = styled.div`
  position: relative;
  top: 11vh;
  width: 91vw;
  margin: 0 auto;
  overflow: hidden;
  padding: 1vh 1vw;
  margin-bottom: 15vh;
  gap: 1.1vw;
  cursor: pointer;
  align-items: center;
  scroll-behavior: smooth;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  > div {
    flex: 0 0 auto; // flex 아이템 너비 고정
    position: relative;
    padding: 10px; // 포스터 주변 패딩
    background: #fff; // 포스터 배경
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); // 그림자 효과
    border-radius: 10px; // 모서리 둥글게
    cursor: pointer;
    img {
      display: block;
      width: 100%; // 이미지 가로 크기 조정
      height: auto; // 이미지 세로 크기 자동 조정
      border-radius: 8px; // 이미지 모서리 둥글게
    }
    transition: all 0.2s ease;
    &:hover {
      background: #4F526B;
      transform: translateY(-2px); // 클릭 유도를 위한 애니메이션 효과
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
  
    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    }
  }
`;

export const TopSection = styled.div`
  position: relative;
  top: 25vh;
  display: flex;
  margin-bottom: 20vh;
  align-items: center; // 세로 중앙 정렬
  justify-content: center;
`;

export const GridContainer = styled.div`
  display: flex; /* Flexbox 사용 */
  justify-content: space-evenly;
`;

// export const RefreshIcon = styled.img`
//   cursor: pointer;
//   width: 80px;
//   height: 80px;
// `;

export const Text1 = styled.div`
position: relative;
margin-bottom: 5vh;
width: 485px;
display: flex;
padding: 1vh 1vw;
height: 50px;
font-family: 'Noto Sans KR';
font-style: normal;
font-weight: 400; 
font-size: 24px;
line-height: 35px;
color: #f4f3f3;
align-items: center;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
border-radius: 10px;
border: 1px solid #535D7E;
`;

export const Text2 = styled.div`
position: absolute;
width: 885px;
height: 44.96px;
left: calc(50% - 885px/2 - 0.5px);
top: 70px;
font-family: 'Inter';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 19px;
color: #c8c8c8;

`;

export const Submit = styled.button`
  width: 10vw;
  height: 8vh;
  background: #898FC0;
  color: #FFF; // 버튼 텍스트 색상
  border: none; // 기본 테두리 제거
  border-radius: 1.875rem;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25); // 그림자 조정
  transition: all 0.2s ease;

  &:hover {
    background: #4F526B;
    transform: translateY(-2px); // 클릭 유도를 위한 애니메이션 효과
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;

export const SubmitContainer = styled.div`
  display: flex;
  flex-direction: column;
  top: 6vh;
  align-items: center;
  position: relative;
  padding-bottom: 10vh;
`;


export const SubmitBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 40%;
  margin: 0 auto;
  margin-bottom: 10vh;
  padding: 20px;
  background: #2A2F42; // 영화 테마 색상
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  border: 1px solid #535D7E;

  .movie-item {
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    }
  }

  img {
    width: 100px;
    height: auto;
    border-radius: 8px;
  }
`;


export const SubmitContent = styled.div`
  margin: 10px; // 주변 요소와의 간격
  padding: 10px; // 내부 패딩
  border-radius: 10px; // 모서리 둥글게
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); // 그림자 효과
  transition: transform 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.05); // 호버 시 약간 확대
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100%; // 이미지 가로 크기를 부모 요소에 맞춤
    height: auto; // 이미지 높이 자동 조정
    border-radius: 8px; // 이미지 모서리 둥글게
  }
`;

export const StyledRefreshIcon = styled(MdRefresh)`
  color: whitesmoke;
  font-size: 40px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, color 0.2s ease;

  &:hover {
    color: #4F526B;
    transform: translateY(-1px); // 클릭 유도를 위한 애니메이션 효과

  }
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;