# Space Assault - システム環境・インフラ構成ドキュメント

本ドキュメントは、2Dアクションシューティングゲーム「**Space Assault**」のインフラ構成、使用技術、および設定手順をまとめた仕様書です。
すべてのコンポーネントは**完全無料（ランニングコスト0円）**かつ**専用サーバー管理不要（サーバーレス）**で運用できるよう設計されています。

---

## 1. 全体の無料構成概要

| 役割 | 採用技術・サービス | 費用 | 特徴・選定理由 |
| :--- | :--- | :---: | :--- |
| **ゲーム公開（Webホスティング）** | **GitHub Pages** | **0円** | 静的ファイル（HTML / CSS / JS）を世界中にCDN配信。HTTPS対応、Git pushで自動即時反映。 |
| **リアルタイム・マルチプレイ** | **JavaScript ＋ PeerJS (WebRTC)** | **0円** | プレイヤー同士のブラウザ間P2P通信。サーバーを経由しないため超低遅延＆サーバー維持費0円。 |
| **オンライン・リーダーボード** | **JavaScript ＋ Firebase Firestore** | **0円** | Google CloudのサーバーレスNoSQLデータベース。スコアアタック／ボス討伐タイムをリアルタイム保存・同期。 |

---

## 2. アーキテクチャ構成図

```
                    ┌─────────────────────────┐
                    │      GitHub Pages       │
                    │  (HTML5 / CSS3 / JS)    │
                    └────────────┬────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
┌─────────────────────────┐                 ┌─────────────────────────┐
│  Firebase Firestore     │                 │   PeerJS (WebRTC P2P)   │
│  (クラウドデータベース) │                 │  (リアルタイム通信)     │
│                         │                 │                         │
│ ・スコアアタック記録    │                 │ ・プレイヤー座標同期    │
│ ・ボス討伐タイム        │                 │ ・ボスHP同期            │
│ ・PC / Mobile別集計     │                 │ ・スキル発動エフェクト  │
└─────────────────────────┘                 └─────────────────────────┘
```

---

## 3. 各コンポーネントの詳細と設定情報

### 3.1 Webホスティング: GitHub Pages

- **公開URL**: [https://fj2323hw.github.io/space-assault/](https://fj2323hw.github.io/space-assault/)
- **リポジトリ**: `https://github.com/fj2323hw/space-assault.git`
- **デプロイブランチ**: `main` (ルート `/`)
- **運用フロー**:
  1. ローカルでコード編集
  2. `git add .`
  3. `git commit -m "更新内容"`
  4. `git push origin main`（push後、1〜2分で自動反映）

---

### 3.2 オンラインリーダーボード: Firebase Firestore

Googleが提供するNoSQLクラウドデータベースを採用。クライアントサイドJavaScriptから直接アクセスすることで、中継バックエンドサーバーを不要にしています。

#### 構成詳細
- **プロジェクトID**: `space-assault-game`
- **使用コレクション**: `leaderboard`
- **SDK**: Firebase JS SDK v10 (Compat版)

#### 保存データスキーマ (`leaderboard` ドキュメント)
```json
{
  "name": "Player1",
  "mode": "SCORE_ATTACK",
  "score": 12500,
  "time": 0,
  "level": 1,
  "device": "pc",
  "date": "2026-09-06",
  "timestamp": 1788779948000
}
```

#### セキュリティルール設定 (`firestore.rules`)
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

### 3.3 リアルタイム・マルチプレイ: PeerJS (WebRTC)

- **通信方式**: P2P (Peer to Peer / WebRTC DataChannel)
- **シグナリング**: PeerJS Cloud（無料パブリックシグナリングサーバー利用）
- **同期データ**:
  - ホスト / クライアント接続（Room ID共有）
  - プレイヤー座標 `(x, y)`、向き、移動アニメーション
  - ボスHPゲージの同期
  - スキル発動（ブリンク、ボム、ホーミング弾、必殺技）のイベント通知

---

## 4. コストと拡張性について

- **月額固定費**: **0円**
- **無料枠上限（目安）**:
  - **GitHub Pages**: 月間100GBトラフィック（小中規模ゲームなら十分）
  - **Firebase Firestore**: 1日あたり 50,000回読み取り / 20,000回書き込み（数千人が毎日遊んでも無料枠内）
  - **PeerJS**: P2P通信のため、通信量はユーザー間の帯域のみ消費しサーバー費用ゼロ
