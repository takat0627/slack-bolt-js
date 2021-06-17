# ベースイメージを指定
FROM node

COPY ./app/package.json .
RUN npm install

# ディレクトリを移動する
WORKDIR /app
