# Prosemaze

Prosemazeはオンラインゲームブックを作るテンプレートです。

## How to use Prosemaze

リポジトリのクローンを作成するか、ダウンロード、解凍して下さい。

## Directory Layout

```
    app/
      index.html        --> The index.html
      app.html          --> アプリケーションファイル。index.htmlからiframeで読み込む
      app-async.html    --> app.htmlと同等だが、jsファイルを非同期で読み込む
      scenario/         --> シナリオディレクトリ
        chara/            --> キャラクター画像
        data/             --> ページシナリオファイル
        scene/            --> シーン画像
      img/
        index.css       --> index.htmlの
以下のディレクトリは変更しないでください。
    css/                    --> cssファイル
      js/                   --> javascriptファイル
      lib/                  --> angularとサードパーティー製のjavascriptライブラリ
      partials/             --> htmlテンプレートファイル
```

## Scenario filse

シナリオファイルは全てUTF-8で保存してください。

### config.json

全体設定に関するファイルです。
ファイルフォーマットはJSONです。

```
{
  "title": "title of game",
  "navTitle": false,         --> ナビゲーションに[Title]ボタンを表示する
  "pages": 15,               --> ナビゲーションのページボタン数
  "width": "960px",          --> ステージの幅
  "height": "540px",         --> ステージの高さ
  "cache": true              --> キャッシュリソースを使用
}
```

navTitle は true または false を指定してください。
pages に 0 を指定するとナビゲーションのページボタンが表示されません。

cache を false にすると、各ページのデータファイルを強制的に読み込みます。デバッグ中のみfalseにしてください。
config.jsonファイルは常に再読み込みを行います。

### ページファイル

scenario/data ディレクトリに「連番＋.json」で保存してください。
0.jsonはタイトル画面で表示します。

#### ファイルフォーマット

ファイルフォーマットはJSONです。

```
{
  "lines": [                        --> ダイアログメッセージ
    "あいうえおかきくけこさしすせそ",      3行ずつページングする
    "かきくけこさしすせそたちつてと",
    "さしすせそたちつてとなにぬねの",
    "たちつてとなにぬねのはひふへほ",
    "なにぬねのはひふへほまみむめも",
    "はひふへほまみむめもらりるれろ"
  ],
  "scene": "start.jpg",      --> シーン背景画像
  "charas": [                --> キャラクター表示指定
    {
      "url": "chara1.png",   --> キャラクターのファイル名
      "left": "300px",       --> 表示位置（左端）
      "top": "100px",        --> 表示位置（上端）
      "show": 0              --> 表示タイミング
    },
    {
      "url": "chara2.png",
      "left": "30px",
      "top": "290px",
      "show": 1
    }
  ],
  "select": [                --> ページ分岐
    "何をする？",              --> 次のページへの移動可否
    "かるた",                 --> 偶数行目と次の奇数行目をセットとして、
     5,                          偶数行目は表示ラベル、奇数行目は選択時の移動先ページ番号
    "ふくわらい",
     8
  ],
  "next": true               --> 次のページへの移動可否
}                                selectがある場合は無視される
```


## Contact

For more information on Prosemaze please check out [Wicker Wings](http://www.wi-wi.jp/)
