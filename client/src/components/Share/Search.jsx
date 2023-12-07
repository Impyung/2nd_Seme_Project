import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';


const SearchInfo = styled.div`
  position: relative;
  width: 55vw;
  height: 7vh;
  left: calc(50% - 55vw/ 2 );
  top: 16vh;
  background: linear-gradient(0deg, #2A2F42 10%, #1C1E2C 90%); // Adjust the gradient direction and color stops
  border: 2px solid #f4f3f3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4f3f3;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #f4f3f3;
  font-family: 'Noto Sans KR', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 1.3vw;
  line-height: 2vw;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  ::placeholder {
    color: #f4f3f3; /* 원하는 색상으로 변경 */
  }
`;
function Search() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      navigate('/page6', { state: { searchQuery: inputValue } });
    }
  };

  const handleSearchClick = () => {
    navigate('/page6', { state: { searchQuery: inputValue } });
  };

  return (
    <SearchInfo>
      <SearchInput
        type="text"
        placeholder="영화 제목을 입력해 주세요"
        className="search_input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
       <FaSearch
        onClick={handleSearchClick}
        style={{ cursor: 'pointer', fontSize: '1.5vw', marginLeft: '-5vw' }}
      />
    </SearchInfo>
  );
}

export default Search;
