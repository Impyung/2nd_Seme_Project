from flask import Flask, request, jsonify, session
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from collections import Counter
from flask_cors import CORS
import json
from pymongo import MongoClient
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
# 모든 도메인에서의 요청을 허용
CORS(app)

username = None

# 기존의 영화 데이터셋 로드
df = pd.read_csv('movieDataSet3.csv')
df['genres'] = df['genres'].fillna('')
# NaN 값을 빈 문자열로 변환
df['summary'] = df['summary'].fillna('')

# TF-IDF Vectorizer 초기화
tfidf = TfidfVectorizer(stop_words='english')

# 데이터셋의 'summary' 칼럼에 대해 TF-IDF 행렬을 계산
tfidf_matrix_summary = tfidf.fit_transform(df['summary'])

# 데이터셋의 'genres' 칼럼에 대해 TF-IDF 행렬을 계산
tfidf_matrix_genres = tfidf.fit_transform(df['genres']) 

# 각 행렬을 합치거나 연결하여 하나의 TF-IDF 행렬로 만듦 (예를 들어 scipy의 hstack 사용)
from scipy.sparse import hstack
tfidf_matrix_combined = hstack((tfidf_matrix_summary, tfidf_matrix_genres))

# 코사인 유사도 매트릭스 계산
cosine_sim = linear_kernel(tfidf_matrix_combined, tfidf_matrix_combined)

# 영화의 타이틀과 DataFrame 인덱스를 매핑할 딕셔너리를 생성
indices = pd.Series(df.index, index=df['title']).to_dict()

# 제목을 기반으로 추천을 받는 함수
def get_recommendations(title, cosine_sim=cosine_sim):
    # 선택한 영화에 대한 인덱스 가져오기
    idx = indices[title]

    # 해당 영화의 유사도 점수를 가져오기
    sim_scores = list(enumerate(cosine_sim[idx]))

    # 유사도에 따라 영화들을 정렬
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # 가장 유사한 10개의 영화를 가져오기
    sim_scores = sim_scores[1:11]

    # 영화의 인덱스를 가져오기
    movie_indices = [i[0] for i in sim_scores]

    # 가장 유사한 10개의 영화 제목을 반환
    return df['title'].iloc[movie_indices]

@app.route('/movies', methods=['GET'])

def recommend_movies():
    # 쿼리 매개변수로 'title' 가져오기
    title = request.args.get('title', '')
    if title:
        try:
            recommendations = get_recommendations(title)
            # JSON 형태로 추천 영화 목록 반환
            return jsonify(recommendations=recommendations.tolist())
        except KeyError:
            # 입력된 제목이 데이터셋에 없는 경우
            return jsonify({"error": "Movie not found in the dataset"}), 404
    else:
        # 제목이 제공되지 않은 경우
        return jsonify({"error": "No title provided"}), 400
# ---------------------------------------------------------------------------------------------

# 현재 상영 중인 영화 데이터셋 로드
now_playing_df = pd.read_csv('nowPlaying.csv')
now_playing_df['genres'] = now_playing_df['genres'].fillna('')
now_playing_df['overview'] = now_playing_df['overview'].fillna('')

@app.route('/nowplaying', methods=['GET'])

def recommend_playing_movies():
    # 사용자의 관람 이력에서 장르 가져오기
    user_history = request.args.getlist('watched_genres')
    if not user_history:
        return jsonify({"error": "No watched genres provided"}), 400

    # 장르 별 빈도수 계산
    genre_counts = Counter(user_history)
    
    # 가장 많이 본 상위 장르들 추출 (예: 상위 3개)
    top_genres = [genre for genre, _ in genre_counts.most_common(3)]

    # 현재 상영 중인 영화 중 상위 장르들 중 하나라도 포함하는 영화 추천
    recommended_movies = now_playing_df[now_playing_df['genres'].apply(lambda genres: any(genre in genres for genre in top_genres))]
    
    if recommended_movies.empty:
        return jsonify({"error": "No movies found for the most watched genres"}), 404
    
    return jsonify(recommendations=recommended_movies['title'].tolist())










@app.route('/token', methods=['POST'])

def receive_token():
    # JSON 요청 데이터 추출
    data = request.json
    global username
    username = data.get('userId')

    # userId 값 확인
    if username:
        # userId를 사용하여 필요한 처리 수행
        return jsonify({'message': 'Success', 'userId': username})
    else:
        # userId가 제공되지 않은 경우 오류 메시지 반환
        return jsonify({'error': 'UserId not provided'}), 400



@app.route('/RcmAllMovie', methods=['GET'])

def recommend_all_movies():
    # JSON 파일로부터 데이터를 로드합니다
    with open('/Users/lsh549516/Desktop/웹프로그래밍/TGI/MT/data/all-movies.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    # DataFrame을 생성합니다
    movies_df = pd.DataFrame(data)
    movies_df['genre_ids'] = movies_df['genre_ids'].apply(lambda x: ', '.join(map(str, x)))
    movies_db = movies_df[['title', 'genre_ids', 'vote_average']]

    # 사용자 시청 기록
    user_df = pd.DataFrame({
        'title': ['트롤 밴드 투게더', '슈퍼 마리오 브라더스', '엘리멘탈','레오'],
        'genre_ids': ['16, 10751, 10402, 14, 35', '16,10751,12,14,35', '16,35,10751,14,10749','16,35,10751'],
        'vote_average': [7.200, 7.746, 7.7,7.803],
        'user_rating': [8.6, 8, 9, 7]
    })

    # 장르별 사용자 평점을 저장할 딕셔너리 초기화
    genre_ratings = {}

    # 각 영화에 대해 반복
    for index, row in user_df.iterrows():
        # 영화의 장르 리스트
        genres = row['genre_ids'].split(',')
        # 각 장르에 대해 사용자 평점 추가
        for genre in genres:
            genre = genre.strip()  # 공백 제거
            if genre in genre_ratings:
                genre_ratings[genre].append(row['user_rating'])
            else:
                genre_ratings[genre] = [row['user_rating']]

    # 최소 평가 횟수 설정
    min_reviews = 2

    # 장르별 가중 평균 점수 계산 (최소 평가 횟수 이상인 경우에만)
    genre_avg_ratings = {genre: sum(ratings) / len(ratings) for genre, ratings in genre_ratings.items() if len(ratings) >= min_reviews}

    # 상위 3개 장르 찾기 (가중 평균 점수가 계산된 장르 중에서)
    top_genres = sorted(genre_avg_ratings, key=genre_avg_ratings.get, reverse=True)[:4]


    # 함수 정의: 주어진 장르 리스트가 영화의 장르에 모두 포함되는지 확인
    def contains_all_genres(movie_genres, genres_to_check):
        return all(genre in movie_genres for genre in genres_to_check)

    # 추천 영화 목록
    recommendations = {
        "1st_priority": [],
        "2nd_priority": []
    }

    # 전체 영화 데이터에서 장르별로 추천
    for index, row in movies_df.iterrows():
        movie_genres = row['genre_ids'].split(', ')

        # 1순위 추천: 상위 4개 장르 모두 포함
        if contains_all_genres(movie_genres, top_genres):
            recommendations["1st_priority"].append(row['title'])

        # 2순위 추천: 상위 3개 장르 모두 포함
        elif contains_all_genres(movie_genres, top_genres[:3]):
            recommendations["2nd_priority"].append(row['title'])

    # 결과 출력
    all_recommendations = (recommendations["1st_priority"] + recommendations["2nd_priority"])

    # 중복 제거
    unique_recommendations = list(set(all_recommendations))

    # 평점에 따라 영화 정렬
    sorted_movies = movies_df[movies_df['title'].isin(unique_recommendations)].sort_values(by='vote_average', ascending=False)

    # 상위 10개 영화 선택
    top_10_movies = sorted_movies.head(10)



    recommended_titles = top_10_movies.to_dict('records')

    # 딕셔너리 리스트를 JSON 형태로 변환하여 반환
    return jsonify(recommended_titles)
    


# if __name__ == '__main__':
app.run(debug=True)





    # 토큰별 데이터 불러오는 코드
    # global username

    # url = "mongodb+srv://Pyung:qTIXQTenPZUaxkwq@cluster0.zf3jrtq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    # client = MongoClient(url)

    # db = client['forum']

    # collection = db['record']

    # # Fetching all documents in the collection
    # documents = collection.find({'username': f'{username}'})

    # documents_list = []

    # # Printing the documents
    # for d in documents:
    #     documents_list.append(d)
    # user_df = pd.DataFrame(list(documents_list))
    # user_df['genre_ids'] = user_df['genre_ids'].apply(lambda x: ', '.join(map(str, x)))
    # print(user_df)








# ---------------------------------------------------------------------------------------------
# # TF-IDF 벡터 생성 (요약 내용)
# tfidf_vectorizer = TfidfVectorizer(stop_words='english')
# tfidf_matrix = tfidf_vectorizer.fit_transform(data['overview'])

# # 코사인 유사도 계산 (요약 내용에 대한 유사도)
# cosine_sim_overview = linear_kernel(tfidf_matrix, tfidf_matrix)

# # 영화의 타이틀과 DataFrame 인덱스를 매핑할 딕셔너리를 생성
# indices = pd.Series(now_playing_df.index, index=now_playing_df['title']).to_dict()

# # 제목을 기반으로 추천을 받는 함수
# def get_combined_recommendations(title, cosine_sim=cosine_sim):
#     # 선택한 영화에 대한 인덱스 가져오기
#     idx = indices[title]

#     # 해당 영화의 유사도 점수를 가져오기
#     sim_scores = list(enumerate(cosine_sim[idx]))

#     # 유사도에 따라 영화들을 정렬
#     sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

#     # 가장 유사한 10개의 영화를 가져오기
#     sim_scores = sim_scores[1:11]

#     # 영화의 인덱스를 가져오기
#     movie_indices = [i[0] for i in sim_scores]

#     # 가장 유사한 10개의 영화 제목을 반환
#     return now_playing_df['title'].iloc[movie_indices]

# @app.route('/movies2', methods=['GET'])

# def recommend_movies2():
#     # 쿼리 매개변수로 'title' 가져오기
#     title = request.args.get('title', '')
#     if title:
#         try:
#             recommendations = get_combined_recommendations(title)
#             # JSON 형태로 추천 영화 목록 반환
#             return jsonify(recommendations=recommendations.tolist())
#         except KeyError:
#             # 입력된 제목이 데이터셋에 없는 경우
#             return jsonify({"error": "Movie not found in the dataset"}), 404
#     else:
#         # 제목이 제공되지 않은 경우
#         return jsonify({"error": "No title provided"}), 400



# @app.route('/movies_history', methods=['GET'])
# def recommend_based_on_history():
#     # 쿼리 매개변수로 영화 제목 목록 가져오기 (예: 'title1,title2,title3,...')
#     history = request.args.get('history', '')
#     if history:
#         history_list = history.split(',')
#         all_recommendations = []

#         # 가중치 적용: 최근에 본 영화에 더 많은 가중치 부여
#         for i, title in enumerate(reversed(history_list)):
#             try:
#                 recommendations = get_recommendations(title)
#                 weighted_recommendations = [(rec, 1 / (i + 1)) for rec in recommendations.tolist()]
#                 all_recommendations.extend(weighted_recommendations)
#             except KeyError:
#                 # 영화 제목이 데이터셋에 없는 경우
#                 continue

#         # 추천 목록에서 중복 제거 및 가중치 적용
#         recommendations_scores = Counter()
#         for rec, weight in all_recommendations:
#             recommendations_scores[rec] += weight

#         # 가중치에 따라 정렬된 추천 목록 반환
#         sorted_recommendations = [rec for rec, _ in recommendations_scores.most_common()]
#         return jsonify(recommendations=sorted_recommendations)
#     else:
#         # 영화 목록이 제공되지 않은 경우
#         return jsonify({"error": "No history provided"}), 400