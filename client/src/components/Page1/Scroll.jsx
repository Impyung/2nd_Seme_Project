import { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const Page1ScrollButton = styled.button`
  position: absolute;
  width: 55px;
  height: 55px;
  background: #434b69;
  box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.3);
  border-radius: 100%;
  opacity: 80%;
  transition: all 0.3s ease;

  &:hover {
    background: #535d7e;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    opacity: 100%;
  }

  display: flex;
  justify-content: center;
  align-items: center;
`;

function Page1Scroll() {
  const [count, setCount] = useState(0);

  const scrollRight = () => {
    var scrollableDiv = document.getElementById('scroll');
    scrollableDiv.scrollLeft += 391;
    setCount(count + 1);
  };

  const scrollLeft = () => {
    var scrollableDiv = document.getElementById('scroll');
    scrollableDiv.scrollLeft -= 391;
    setCount(count - 1);
  };

  return (
    <>
      {count > 0 && (
        <Page1ScrollButton
          id='scrollLeft'
          style={{ left: '3vw', top: '140vh' }}
          onClick={scrollLeft}
        >
          <FontAwesomeIcon icon={faAngleLeft} color="white" />
        </Page1ScrollButton>
      )}

      {count < 4 && (
        <Page1ScrollButton
          id='scrollRight'
          style={{ right: '3vw', top: '140vh'  }}
          onClick={scrollRight}
        >
          <FontAwesomeIcon icon={faAngleRight} color="white" />
        </Page1ScrollButton>
      )}
    </>
  );
}

export default Page1Scroll;
