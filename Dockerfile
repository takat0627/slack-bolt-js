# ベースイメージを指定
FROM node

COPY ./node/package.json .
RUN npm install

# ディレクトリを移動する
WORKDIR /app
