import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {Rings} from "react-loader-spinner"; 


const MapWrap = styled.div`
  position: relative;
  width: 420px;
  height: 320px;
  left: 8vw;
  top: 8vh;
  background: #2a2f42;
  border: 1px solid #f4f3f3;
  border-radius: 10px;
`;

const Map = styled.div`
  position: absolute;
  width: 400px;
  height: 300px;
  left: 10px;
  top: 10px;
  border-radius: 5px;
  font-size: 36px;
`;

const MenuWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 150px;
  margin: 10px 0 30px 10px;
  padding: 5px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  font-size: 12px;
  border-radius: 10px;
  display: none;
`;

export const TextBox = styled.div`
  position: absolute;
  height: 559px;
  left: 880px;
  top: 90px;
  background: #2A2F42;
  padding-left: 20px;
  padding-top: 30px;
  font-size: 27px;
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

  &:hover {
    background-color: #4F5B93; /* Change color on hover */
    transform: translateY(-2px); /* Slight lift on hover */
  }

  &:active {
    transform: translateY(1px); /* Depress button on click */
  }
`;

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Option = styled.div`
  text-align: center;
`;

const PlacesList = styled.ul`
  list-style: none;
`;

const Pagination = styled.div`
  margin: 10px auto;
  text-align: center;
`;

export default function MapTest({onDataChange}) {
  const mapElement = useRef(null);

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.onload = () => initializeMapScript();
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=f38a5374b3a20d033ebd3107df6bfe06&autoload=false&libraries=services,clusterer,drawing`;
    document.head.appendChild(mapScript);

    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(mapScript);
    };
  }, []);

  const initializeMapScript = () => {
    if (mapElement.current && window.kakao && window.kakao.maps) {
      var markers = [];
      var map;
      var DEFAULT_LATITUDE = 37.5665;
      var DEFAULT_LONGITUDE = 126.978;
      var userLocation;

      navigator.geolocation.getCurrentPosition(
        function (position) {
          window.kakao.maps.load(() => {
            userLocation = new window.kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            initializeMap(userLocation);
            searchPlaces(userLocation);
          });
        },
        function (error) {
          console.error('Error getting user location:', error);
          var userLocation = new window.kakao.maps.LatLng(
            DEFAULT_LATITUDE,
            DEFAULT_LONGITUDE
          );
          initializeMap(userLocation);
          searchPlaces(userLocation);
        },
        { enableHighAccuracy: true }
      );

      const initializeMap = (center) => {
        var mapOptions = {
          center: center,
          level: 3,
        };
        map = new window.kakao.maps.Map(
          document.getElementById('map'),
          mapOptions
        );
      };

      const searchPlaces = (location) => {
        var keyword = document.getElementById('keyword').value;
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
          alert('키워드를 입력해주세요!');
          return false;
        }
        var ps = new window.kakao.maps.services.Places();
        ps.keywordSearch('근처 영화관', placesSearchCB, {
          location: location,
          radius: 3000,
        });
      };

      const placesSearchCB = (data, status, pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          displayPlaces(data);
          displayPagination(pagination);
          // console.log(data);
          onDataChange(data);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          alert('검색 결과가 존재하지 않습니다.');
          return;
        } else if (status === window.kakao.maps.services.Status.ERROR) {
          alert('검색 결과 중 오류가 발생했습니다.');
          return;
        }
      };

      const getListItem = (index, places) => {
        var el = document.createElement('li'),
          itemStr =
            '<span class="markerbg marker_' +
            (index + 1) +
            '"></span>' +
            '<div class="info">' +
            '   <h5>' +
            places.place_name +
            '</h5>';
        if (places.road_address_name) {
          itemStr +=
            '    <span>' +
            places.road_address_name +
            '</span>' +
            '   <span class="jibun gray">' +
            places.address_name +
            '</span>';
        } else {
          itemStr += '    <span>' + places.address_name + '</span>';
        }
        itemStr += '  <span class="tel">' + places.phone + '</span>' + '</div>';
        el.innerHTML = itemStr;
        el.className = 'item';
        return el;
      };

      const addMarker = (position, idx) => {
        var imageSrc =
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
          imageSize = new window.kakao.maps.Size(36, 37),
          imgOptions = {
            spriteSize: new window.kakao.maps.Size(36, 691),
            spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
            offset: new window.kakao.maps.Point(13, 37),
          },
          markerImage = new window.kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imgOptions
          ),
          marker = new window.kakao.maps.Marker({
            position: position,
            image: markerImage,
          });
        marker.setMap(map);
        markers.push(marker);
        return marker;
      };

      const removeMarker = () => {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      };

      const displayPagination = (pagination) => {
        var paginationEl = document.getElementById('pagination'),
          fragment = document.createDocumentFragment(),
          i;
        while (paginationEl.hasChildNodes()) {
          paginationEl.removeChild(paginationEl.lastChild);
        }
        for (i = 1; i <= pagination.last; i++) {
          var el = document.createElement('a');
          el.href = '#';
          el.innerHTML = i;
          if (i === pagination.current) {
            el.className = 'on';
          } else {
            el.onclick = (function (i) {
              return function () {
                pagination.gotoPage(i);
              };
            })(i);
          }
          fragment.appendChild(el);
        }
        paginationEl.appendChild(fragment);
      };

      const displayInfowindow = (marker, title) => {
        var infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        var content =
          '<div style="padding:5px;z-index:1;color:black;">' + title + '</div>';
        infowindow.setContent(content);
        infowindow.open(map, marker);
      };

      const removeAllChildNods = (el) => {
        while (el.hasChildNodes()) {
          el.removeChild(el.lastChild);
        }
      };

      const displayPlaces = (places) => {
        var infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        var listEl = document.getElementById('placesList'),
          menuEl = document.getElementById('menu_wrap'),
          fragment = document.createDocumentFragment(),
          bounds = new window.kakao.maps.LatLngBounds();
        removeAllChildNods(listEl);
        removeMarker();
        var placesCount = Math.min(places.length, 3);
        for (var i = 0; i < placesCount; i++) {
          var placePosition = new window.kakao.maps.LatLng(
              places[i].y,
              places[i].x
            ),
            marker = addMarker(placePosition, i),
            itemEl = getListItem(i, places[i]);
          addClickListenerToMarker(marker, places[i]);
          bounds.extend(placePosition);
          (function (marker, title) {
            window.kakao.maps.event.addListener(
              marker,
              'mouseover',
              function () {
                displayInfowindow(marker, title);
                console.log(title);
              }
            );
            window.kakao.maps.event.addListener(
              marker,
              'mouseout',
              function () {
                infowindow.close();
              }
            );
            itemEl.onmouseover = function () {
              displayInfowindow(marker, title);
            };
            itemEl.onmouseout = function () {
              infowindow.close();
            };
          })(marker, places[i].place_name);
          fragment.appendChild(itemEl);
        }
        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;
        map.setBounds(bounds);
      };

      const addClickListenerToMarker = (marker) => {
        window.kakao.maps.event.addListener(marker, 'click', function () {
          var clickedMarkerPosition = marker.getPosition();
          var targetLatitude = clickedMarkerPosition.getLat();
          var targetLongitude = clickedMarkerPosition.getLng();
          var destination = new window.kakao.maps.LatLng(
            targetLatitude,
            targetLongitude
          );
          var origin = new window.kakao.maps.LatLng(
            userLocation.getLat(),
            userLocation.getLng()
          );
          var polyline = new window.kakao.maps.Polyline({
            path: [origin, destination],
            strokeWeight: 3,
            strokeColor: 'blue',
            strokeOpacity: 0.3,
            strokeStyle: 'solid',
          });
          polyline.setMap(map);
          if (prevPolyline) {
            prevPolyline.setMap(null);
          }
          prevPolyline = polyline;
        });
      };

      var prevPolyline;
    }
  };

  return (
    <MapWrap>
      <Map ref={mapElement} id="map">
        <LoaderWrapper>
          <Rings
            color="#2f5792" 
            height={200} 
            width={200}
            />
        </LoaderWrapper>
      </Map>

      <MenuWrap id="menu_wrap" className="bg_white">
        <Option className="option">
          <form>
            <input type="text" value="영화관" id="keyword" size="15" />
            <button type="submit">검색하기</button>
          </form>
        </Option>
        <hr />
        <PlacesList id="placesList"></PlacesList>
        <Pagination id="pagination"></Pagination>
      </MenuWrap>
    </MapWrap>
  );
}

//dapi.kakao.com/v2/maps/sdk.js?appkey=f38a5374b3a20d033ebd3107df6bfe06&autoload=false&libraries=services,clusterer,drawing
