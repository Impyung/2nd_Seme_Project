import styled from "styled-components";

const ImageBox = styled.div`
  position: relative;
  top: 17vh;
`;

const Image = styled.div`
  width: 300px;
  height: 420px;
  background: #d9d9d9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;

const TextInfo = styled.div`
width: 298px;
height: 181px;
font-family: 'Inter';
font-style: normal;
font-weight: 500;
font-size: 24px;
line-height: 40px;
display: flex;
align-items: center;
color: #F4F3F3;
text-align: left;
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%; /* Adjust the height of the image portion */
  object-fit: cover; /* Maintain aspect ratio and cover the div */
  border-radius: 10px;
`;

function MovieInfo( movie ) {

  return (
    <>
      <ImageBox>
        <Image>
          <PosterImage src={movie.posterUrl}/>
        </Image>
        <TextInfo>감독 : {movie.directorName}<br/>장르 : {movie.genres}<br/>개봉 : {movie.releaseDate}<br/>평점 : {movie.voteAvg} </TextInfo>
      </ImageBox>
    </>
  );
}

export default MovieInfo;