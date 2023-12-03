import useFetchData from './FetchData';
function GenreData() {
  const { data, loading, error } = useFetchData(
    'http://localhost:3000/userRecord/'
  );

  if (loading) return { loading: true };
  if (error) return { error };

  if (Array.isArray(data) && data.length > 0) {
    const allGenreIds = data.flatMap((item) => item.genre_ids);

    const genreCounts = allGenreIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((item) => item[0]);

    return { topGenres, genreCounts, loading, error };
  } else {
    console.log('데이터가 없거나 배열이 아닙니다.');
    return { error: 'No data or not an array' };
  }
}

export default GenreData;
