# 処理
1. secretキーを登録する
    - SLACK_CHANNEL
    - SLACK_BOT_TOKEN
    - SLACK_APP_TOKEN
2. `docker-compose build`
3. `docker-compose up` (バックグラウンドで実行する場合は-d)
    - nodeディレクトリをcomposeファイル直下に作成し，必要なファイル一式をコピーする（ここではignoreへ登録してるので見えない）
