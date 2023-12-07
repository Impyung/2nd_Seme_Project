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

export const Name = styled.div`
position: relative;
width: 149px;
height: 53px;
left: calc(50% - 149px/2 - 0.5px);
top: calc(50% - 53px/2 - 178px);

font-family: 'Noto Sans KR', sans-serif;
font-style: normal;
font-weight: 700;
font-size: 20px;
line-height: 24px;
display: flex;
align-items: center;
justify-content: center;
background: #2A2F42;
color: #F4F3F3;
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

export const ResultContainer = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  position: relative;
  margin-top: 20vh;
  // position: absolute;
  // width: 1170px;
  // height: 450px;
  // top: 190px;
  // left: 35px;
  // overflow: hidden;
  // padding: 20px;
  // border: 1px solid white;
`;

export const ResultGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; // 각 항목 사이의 공간을 균등하게 조정
  gap: 40px;
  padding: 0 30px 60px; // 양쪽에 20px의 패딩 추가
`;



export const SearchText = styled.div`
  position: relative;
  top: 20vh;
  font-size: 20px;
  // position: absolute;
  width: 885px;
  height: 72px;
  left: calc(50% - 885px / 2 - 0.5px);
  font-family: 'Noto Sans KR', sans-serif;
  // top: 140px;
`
export const MovieItem = styled.div`
  flex: 1 1 calc(50% - 20px); // 한 줄에 두 아이템이 들어갈 수 있도록 계산
  max-width: calc(50% - 20px); // 갭을 고려한 최대 너비
  // 추가적인 스타일링...
`;

