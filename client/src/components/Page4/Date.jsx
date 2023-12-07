import { useState } from 'react';
import styled, { css } from 'styled-components'; // css를 임포트
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

const DateInfo = styled.button`
  position: absolute;
  width: 100px;
  height: 52px;
  background: #2a2f42;
  border: 1px solid #f4f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  border-radius: 5px;
  font-family: 'Noto Sans KR', sans-serif;

  // 선택된 날짜에 대한 스타일링
  ${props => props.selected && css`
    background: #1e2230; // 배경색을 더 진하게 설정
  `}
`;

function Date({ onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(""); // 현재 선택된 날짜 상태

  const formatDate = (index) => {
    return currentDate.add(index, 'day').format("MM.DD");
  };

  const formatDayOfWeek = (index) => {
    return currentDate.add(index, 'day').format("ddd");
  };

  const formatRequestDate = (index) => {
    return currentDate.add(index, 'day').format("YYYY-MM-DD");
  };

  const handleClick = (date) => {
    setSelectedDate(date); // 선택된 날짜 업데이트
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <>
      {[19, 126, 233, 340, 447, 554, 661].map((left, index) => {
        const date = formatRequestDate(index);
        return (
          <DateInfo
            key={index}
            style={{ left: `${left}px`, top: "15px" }}
            onClick={() => handleClick(date)}
            selected={date === selectedDate} // 선택 여부에 따라 스타일 변경
          >
            {formatDate(index)}<br/>
            {index === 0 ? '오늘' : formatDayOfWeek(index)}
          </DateInfo>
        );
      })}
    </>
  );
}

export default Date;
