import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
const ImageInfo = styled.div`
    margin-top: 35px;
    margin-left: 35px;
    border-radius: 10px;
    display: flex;
    height: 400px;
`;

const ImageContainer = styled.div`
    max-height: 300px;
`;

const OverviewContainer = styled.div`
  width: 300px;
  height: 320px;
  text-align: left;
  margin-left: 20px;
  margin-right: 30px;
  max-height: 600px; 
  overflow-y: auto;
  padding: 20px;
  
  &::-webkit-scrollbar {
    width: 10px; /* 스크롤바의 너비 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #f3f3f3; /* 스크롤바 색상 */
    border-radius: 10px; /* 스크롤바 모서리 둥글게 */
  }
  &::-webkit-scrollbar-track {
    background-color: #2A2F42; /* 스크롤바 배경 색상 */
  }
`;

const MovieButton = styled.button`
  all: unset;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 10px;

  &:hover {
    background: #4F526B;
    transform: translateY(2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
`;
function Movie({onSelectMovie, poster_path, title, overview, genre_ids}) {
    console.log(genre_ids)
    
    return (
        <MovieButton onClick={() => onSelectMovie({ poster_path, title, overview })}>
        <ImageInfo>
            <ImageContainer>
                <img style={{borderRadius:'10px', width:'250px', height:'375px'}} src={"https://image.tmdb.org/t/p/w300" + poster_path} alt={title}/>
            </ImageContainer>
            <OverviewContainer>
                <h2>{title}</h2>
                <p>{overview}</p>
            </OverviewContainer>
        </ImageInfo>
        </MovieButton>
    );
}
Movie.propTypes ={
    poster_path : PropTypes.string.isRequired,
    title : PropTypes.string.isRequired,
    overview : PropTypes.string.isRequired,
    genre_ids : PropTypes.arrayOf(PropTypes.number).isRequired,
}
export default Movie;

