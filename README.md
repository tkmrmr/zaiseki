# zaiseki

研究室用の在室管理アプリです．

## 技術スタック

- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui

- Backend: Python CGI

- Database: MariaDB

- Runtime: Apache 2.4

## 環境

- Python (推奨バージョン: 3.10, 3.11)
- Node.js (推奨バージョン: 25.x)
- MariaDB（推奨バージョン: 15.x）
- Docker / Docker Compose

## ディレクトリ構成

- `frontend/`: フロントエンド（React + Vite）
- `backend/cgi-bin/zaiseki/api/`: Python CGI エンドポイント
- `backend/cgi-bin/zaiseki/api/common/`: バックエンド共通処理
- `database/schema.sql`: データベーススキーマ
- `docker-compose.yml`: MariaDB, Apache, Adminer の起動設定
- `httpd.conf`: Apache 設定

## 導入

### 1. リポジトリをクローン

```bash
git clone https://github.com/tkmrmr/zaiseki.git
cd zaiseki
```

### 2. .env ファイルを用意

Docker Composeを使う場合はリポジトリ直下に，使わない場合は`backend/cgi-bin/zaiseki`に`.env` ファイルを作成してください．

例：

```.env
MARIADB_USER=testuser
MARIADB_PASSWORD=testpass
MARIADB_HOST=db
MARIADB_DATABASE=lab_db
MARIADB_ROOT_PASSWORD=rootpass # Docker Composeを使用しない場合は不要
```

### 3. Node.jsパッケージのインストール

```bash
cd frontend
npm install
```

## フロントエンド開発

以下のコマンドで開発サーバを起動します．

```bash
cd frontend
npm run dev
```

`/cgi-bin` へのリクエストは，デフォルトで `http://localhost` に送られます．
別のバックエンドを使う場合は，`BASE_URL` を指定してください．

```bash
cd frontend
BASE_URL=http://{BACKEND_HOST} npm run dev
```

開発中のアプリには `http://localhost:5173/zaiseki/` でアクセスできます．

主なルート:

- `/zaiseki/` : 閲覧画面
- `/zaiseki/kiosk` : 操作画面
- `/zaiseki/admin` : 管理画面

## ビルド

フロントエンドを本番環境で動かすときはビルドする必要があります．

```bash
cd frontend
npm run build
```

ビルドしたファイルは `frontend/dist` に出力されます．

ローカル(`http://localhost/zaiseki/`)でビルド結果を確認する場合は以下のコマンドを実行してください．

```bash
cd frontend
npm run preview
```

## バックエンド起動

```bash
docker compose up --build -d
```

`database/schema.sql` は，DB を初回作成するときだけ自動で読み込まれます．
スキーマをもう一度反映したい場合は，以下のようにボリュームを削除してから起動してください．

```bash
docker compose down -v
docker compose up --build -d
```

起動される主なサービス:

- Apache: `http://localhost/zaiseki/`
- Adminer: `http://localhost:8080/`
- MariaDB: `localhost:3306`

## 補足

- `LabMap.tsx` は研究室の配置に合わせて適宜編集してください．

- `frontend/public/.htaccess`はReact RouterをApache上で動かすための設定ファイルです．
