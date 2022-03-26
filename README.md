# notemigration
NotePMのデータをNotionのデータベースに移行する用

# setup

.envファイルの設定
```
NOTION_TOKEN=Notionのアクセストークン
NOTION_DATABASE_ID=Notion側のデータベースID
NOTEPM_TOKEN=NotePMのアクセストークン
NOTEPM_ENDPOINT=NotePMのAPIエンドポイント
```

パラメーターの設定

https://github.com/42zz/notemigration/blob/main/index.js#L20

https://github.com/42zz/notemigration/blob/main/index.js#L72


必要ライブラリのインストール＆実行
```
npm install
node ./
```
