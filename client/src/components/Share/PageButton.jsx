import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PageButtonInfo = styled.div`
  position: fixed;
  width: 11.25rem; // Assuming 1rem = 16px, equivalent to 180px
  height: 1.56rem; // Assuming 1rem = 16px, equivalent to 25px
  font-family: 'Noto Sans KR', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 2.8vh; // Adjusted for 24px
  line-height: 1.81rem; // Adjusted for 29px
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4f3f3;
  cursor: pointer;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.99); /* 그림자 효과 추가 */
  &:hover {
    color: #f4f3f3;
    text-decoration: underline;
    text-underline-position: under;
    transition: 0.5s;
  }
`;

function PageButton() {
  const navigate = useNavigate();

  async function handleTest() {
    try {
      navigate('/page2');
      const response = await axios.get('http://localhost:3000/userRecord/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.warn('인증됐어요');
    } catch (error) {
      console.warn('Error fetching data: ', error);
    }
  }
  return (
    <>
      <Link to="/">
        <PageButtonInfo style={{ left: '25.125vw', top: '4.583vh' }}>
          박스오피스
        </PageButtonInfo>
      </Link>
      <PageButtonInfo
        style={{ left: '39.375vw', top: '4.583vh' }}
        onClick={handleTest}
      >
        상영작 추천
      </PageButtonInfo>
      <Link to="/page5">
        <PageButtonInfo style={{ left: '54.625vw', top: '4.583vh' }}>
          내게 맞는 영화
        </PageButtonInfo>
      </Link>
    </>
  );
}

export default PageButton;
