import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');
import { Page4Context } from '../../Page4';

const TheatherInfo = styled.div`
  position: absolute;
  width: 735px;
  height: 145px;
  background: #4f526b;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 10px;
`;

const DataLoad = styled.div`
  position: absolute;
  width: 735px;
  height: 145px;
  line-height: 75px;
`;

const TheatherName = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  text-align: left;
  margin-left: 23px;
  margin-top: 10px;
`;

const TimeInfo = styled.button`
  position: absolute;
  width: 149px;
  height: 83px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  background: #898fc0;
  color: #000000;
  cursor: pointer;
  z-index: 9999;
`;

// 상영 극장 판별
function checkCinema(code) {
  if (code.charAt(0) == 'C') {
    return 'cgv';
  } else if (code.charAt(0) == '롯') {
    return 'lotte';
  } else if (code.charAt(0) == '메') {
    return 'megabox';
  }
}

// 날짜 형식 변환
function formatDate(inputDate) {
  const dateArray = inputDate.split('-');
  const formattedDate = dateArray.join('');
  return formattedDate;
}

// 상영 시간표 클릭시 해당 영화관 링크
function handleCinemaClick(theatertype, code, date) {
  if (theatertype == 'cgv') {
    window.location.href =
      'http://www.cgv.co.kr/theaters/?areacode=01&theaterCode=' +
      code +
      '&date=' +
      formatDate(date);
  } else if (theatertype == 'lotte') {
    window.location.href =
      'https://www.lottecinema.co.kr/NLCHS/Cinema/Detail?divisionCode=1&detailDivisionCode=1&cinemaID=' +
      code;
  } else if (theatertype == 'megabox') {
    window.location.href =
      'https://www.megabox.co.kr/theater/time?brchNo=' + code;
  }
}

// eslint-disable-next-line react/prop-types
function Theather({ nData, movieName, tData, date}) {
  const [data2, setData2] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const selectedType = useContext(Page4Context);
  const [isDateLoading, setIsDateLoading] = useState(false);

  // 상영 시간표 시간순 정렬 함수
  function parseTime(playTime) {
    const startTime = playTime.split(' - ')[0];
    const [hours, minutes] = startTime.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  useEffect(() => {
    let sortedData = [...data2];
    // 좌석 남은 수 정렬
    if (selectedType === 'seats') {
      for (let i = 0; i < sortedData.length; i++) {
        sortedData[i] = sortedData[i].sort(
          (a, b) => parseInt(a.remainingSeats) - parseInt(b.remainingSeats)
        );
      }
    }
    // 가격순 정렬 
    else if (selectedType === 'price') {
      for (let i = 0; i < sortedData.length; i++) {
        sortedData[i] = sortedData[i].sort((a, b) => {
          // 1순위 조건 체크
          let isAFirstPriority = ['RECLINER', 'THEBOUTIQUE', 'BOUTIQUE', 'PRIVATE', 'SUITE', 'CINE', 'TEMPUR'].some(type => a.screenName.toUpperCase().includes(type));
          let isBFirstPriority = ['RECLINER', 'THEBOUTIQUE', 'BOUTIQUE', 'PRIVATE', 'SUITE', 'CINE', 'TEMPUR'].some(type => b.screenName.toUpperCase().includes(type));
          // 2순위 조건 체크
          let isASecondPriority = ['COMFORT', 'IMAX', '4DX', 'SCREENX'].some(type => a.screenName.toUpperCase().includes(type));
          let isBSecondPriority = ['COMFORT', 'IMAX', '4DX', 'SCREENX'].some(type => b.screenName.toUpperCase().includes(type));
          // 3순위 조건 체크
          let isALaser = a.screenName.toUpperCase().includes('LASER');
          let isBLaser = b.screenName.toUpperCase().includes('LASER');
          // 우선 순위에 따른 정렬 로직
          if (isAFirstPriority && !isBFirstPriority) {
            return -1;
          } else if (!isAFirstPriority && isBFirstPriority) {
            return 1;
          } else if (isASecondPriority && !isBSecondPriority) {
            return -1;
          } else if (!isASecondPriority && isBSecondPriority) {
            return 1;
          } else if (isALaser && !isBLaser) {
            return -1;
          } else if (!isALaser && isBLaser) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    } 
    
    // 시간순 정렬
    else if(selectedType==='time'){
      for (let i = 0; i < sortedData.length; i++) {
        sortedData[i] = sortedData[i].sort((a, b) => parseTime(a.playTime) - parseTime(b.playTime));
      }
    }
    setData2(sortedData); 
    console.log(data2);
  }, [selectedType]); 
  
  // 날짜 선택 후 날짜 업데이트
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  // 크롤링 요청 & 데이터 저장
  useEffect(() => {
    if (tData) {
      setIsDateLoading(true);
      let allData = [];
      let promises = [];
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      const fetchData = async (theaterType, code, retries = 4) => {
        try {
          const response = await axios(
            {
              method: 'get',
              url: `http://43.200.133.130:3000/crawler/${theaterType}/${code}/${
                selectedDate || currentDate
              }`,
            },
            { withCredentials: true }
          );
          const filteredData = response.data.data.filter(
            (item) => item.movieName === movieName
          );
          return filteredData;
        } catch (error) {
          console.log(error);
          if (retries > 0) {
            console.log(`Retrying... Attempts left: ${retries - 1}`);
            await delay(1000);
            return fetchData(theaterType, code, retries - 1);
          }
          return [];
        }
      };
      for (var i = 0; i < nData.length; i++) {
        let promise = fetchData(tData[i].theaterType, tData[i].code);
        promises.push(promise);
      }
      Promise.all(promises).then((results) => {
        allData.push(...results); 
        setData2(allData); 
        setIsDateLoading(false); 
      });
    }
  }, [nData, tData, movieName, selectedDate]);

  return (
    <>
      {[0, 172, 344, 516, 688].map(
        (top, index) =>
          nData[index] && (
            <TheatherInfo key={index} style={{ left: '0px', top: `${top}px` }}>
              <TheatherName>{nData[index].place_name}</TheatherName>
              {isDateLoading && <DataLoad>데이터를 불러오고 있습니다.</DataLoad>}
              {!isDateLoading &&data2[index] &&
                data2[index].map((left, timeIndex) => {
                  // Check if data2 and the required indexes in data2 exist
                  const timeInfoData =
                    data2 && data2[index] && data2[index][timeIndex];
                  return (
                    timeInfoData && (
                      <TimeInfo
                        key={timeIndex}
                        style={{
                          left: `${23 + 166 * timeIndex}px`,
                          top: `45px`,
                        }}
                        onClick={() => {
                          handleCinemaClick(
                            checkCinema(nData[index].place_name),
                            timeInfoData.areaCode,
                            selectedDate || currentDate
                          );
                        }}
                      >
                        {timeInfoData.playTime}
                        <br />
                        {timeInfoData.screenName}
                        <br />
                        잔여좌석 {timeInfoData.remainingSeats}
                      </TimeInfo>
                    )
                  );
                })}
              <DataLoad>
                {isDateLoading && !data2[index] && '데이터를 불러오고 있습니다.'}
              </DataLoad>
              <DataLoad>
                {!isDateLoading &&data2[index] &&
                  data2[index].length === 0 &&
                  '등록된 정보가 없습니다.'}
              </DataLoad>
            </TheatherInfo>
          )
      )}
    </>
  );
}

export default Theather;
