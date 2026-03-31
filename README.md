# zaiseki

研究室用の在室管理アプリです．

## 環境

- Python (推奨バージョン: >=3.11)
- Node.js (推奨バージョン: 25.x)
- MariaDB（推奨バージョン: 15.x）

## 技術スタック

- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui

- Backend: Python CGI

- Database: MariaDB

## 導入

### リポジトリをクローン

```bash
git clone https://github.com/tkmrmr/zaiseki.git
```

### パッケージのインストール

```bash
cd zaiseki
npm install
```

### 開発用サーバを起動

```
npm run dev
```

### ビルド

```
BASE_URL={BASE_URL} npm run build
```

### ビルドした静的サイト用サーバを起動

```
npm run preview
```

## その他

`LabMap.tsx`は研究室の配置に合わせて適宜編集してください．

ローカル環境での動作には`.env`ファイルが必要となります．

例：

```.env
DB_ROOT_PASSWORD=rootpass # Dockerを使用しない場合は不要
DB_USER=testuser
DB_PASSWORD=testpass
DB_HOST=db
DB_NAME=lab_db
```
