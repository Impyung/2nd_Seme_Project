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
    with open('./all-movies.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    # DataFrame을 생성합니다
    movies_df = pd.DataFrame(data)
    movies_df['genre_ids'] = movies_df['genre_ids'].apply(lambda x: ', '.join(map(str, x)))
    movies_db = movies_df[['title', 'genre_ids', 'vote_average']]

    global username

    url = "mongodb+srv://Pyung:qTIXQTenPZUaxkwq@cluster0.zf3jrtq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    client = MongoClient(url)

    db = client['forum']

    collection = db['record']

    # Fetching all documents in the collection
    documents = collection.find({'username': f'{username}'})

    documents_list = []

    # Printing the documents
    for d in documents:
        documents_list.append(d)

    user_data = []

    for data in documents_list:
        user_data.append({
            "title": data["title"],       # 'title' 열 이름 지정
            "genre_ids": data["genre_ids"],  # 'genre_ids' 열 이름 지정
            "user_rating": data.get("rating", 0)
        })

    user_df = pd.DataFrame(user_data)

    user_df['user_rating'] = user_df['user_rating'].astype(float)

    # 영화 DB와 사용자 시청 기록을 결합합니다.
    combined_df = user_df.merge(movies_db, on='title', how='left')

    # TF-IDF 벡터화를 사용하여 장르를 수치화합니다.
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(movies_db['genre_ids'])

    # 사용자가 시청한 영화에 대한 벡터를 추출합니다.
    user_movies_indices = [movies_db.index[movies_db['title'] == title].tolist()[0] for title in user_df['title']]
    user_movies_tfidf = tfidf_matrix[user_movies_indices]

    # 사용자 평점을 가중치로 적용합니다.
    user_ratings = user_df['user_rating'].values
    user_profile = user_movies_tfidf.multiply(user_ratings[:, None]).mean(axis=0)

    # user_profile을 numpy 배열로 변환합니다.
    user_profile_array = np.array(user_profile).reshape(1, -1)

    # 변환된 배열을 사용하여 코사인 유사도를 계산합니다.
    cosine_sim = cosine_similarity(user_profile_array, tfidf_matrix)

    # 사용자의 선호도와 가장 유사한 영화를 찾습니다.
    recommendation_indices = cosine_sim.argsort().flatten()[-8:]

    recommended_movies_info = movies_df.iloc[recommendation_indices]

    recommended_titles = recommended_movies_info.to_dict('records')

    # 추천영화 출력
    print(documents_list)
    # 딕셔너리 리스트를 JSON 형태로 변환하여 반환
    return jsonify(recommended_titles)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, ssl_context=('../../2nd_Seme_Back/rootca.crt', '../../2nd_Seme_Back/rootca.key'))






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