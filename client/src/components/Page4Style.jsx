import styled from 'styled-components';

export const Container = styled.div`
  width: 100%; // 너비를 화면의 100%로 설정
  height: 100vh; // 높이를 화면의 100%로 설정
`;
export const Body = styled.div`
  position: relative;
  display: flex;
  color: #f4f3f3;
  background: linear-gradient(0deg, #2A2F42 30%, #1C1E2C 70%); // Adjust the gradient direction and color stops
  overflow-y: visible;
  overflow-x: hidden;
  height: auto;
`;

export const Reservation = styled.div`
  position: relative;
  width: 777px;
  height: 589px;
  left: 520px;
  top: 30px;
  background: #2A2F42;
  border: 1px solid #F4F3F3;
  border-radius: 10px;
`;

export const DropDownOption = styled.select`
position: relative;
width: 143px;
height: 31px;
left: 621px;
top: 79px;
border-radius:5px;
font-family: 'Inter';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 19px;
display: flex;
align-items: center;
text-align: center;
background: none;
color: #F4F3F3;
`;

export const TheatherGroup = styled.div`
  position: relative;
  width: 735px;
  height: 433px;
  left: 19px;
  top: 121px;
  overflow-y : auto;
  overflow-x : hidden;
`;

export const Header = styled.div`
position: fixed;
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
  position: fixed;
  width: 7vw; // Start with a base size
  height: 11vh; // Maintain aspect ratio
  left: 6vw;
  transition: transform 0.5s ease-in-out;
  &:hover {
    transform: scale(1.1);
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

export const TextBox = styled.div`
  position: relative;
  height: 559px;
  left: 15vw;
  top: 10vh;
  font-size: 24px;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: bold;
  line-height: 50px;
`;

export const StyledButton = styled.button`
  width: 250px;
  height: 90px;
  padding: 10px 20px;
  margin: 20px;
  border: none;
  background: #1C1E2C; /* Light background for the button */
  color: white; /* Dark text color for the button */
  font-weight: bold;
  font-size: 30px;
  border-radius: 10px; /* Rounded corners for the button */
  border: 1px solid #F4F3F3;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  position: relative;
  &:hover {
    background-color: #4F5B93; /* Change color on hover */
    transform: translateY(-2px); /* Slight lift on hover */
  }

  &:active {
    transform: translateY(1px); /* Depress button on click */
  }
`;

export const MapContainer = styled.div`
  position: relative;
  top:11vh;
  display: flex;
  height: 100vh;
`;

export const TheaterContainer = styled.div`
position: relative;
top:11vh;
height: 100vh;
font-family: 'Noto Sans KR', sans-serif; 
`;