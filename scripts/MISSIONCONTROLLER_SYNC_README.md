# 🎯 MissionController → Notion 完全同期システム

## 📋 概要

**MissionController全体のデータ**をNotionに同期させるシステムです。
- Tasks (タスク管理)
- Content (コンテンツ制作)
- Calendar (スケジュール)
- Memory (メモリ・ドキュメント)
- Team (チーム・エージェント)

これらすべてのデータが**1時間毎**にNotionに自動同期されます。

## 🚀 セットアップ

### 1. 初期化（一度だけ実行）
```bash
cd /home/kunekune/mission-control-dashboard
npm run missioncontroller:init
```

**作成されるもの:**
- 🎯 MissionController Dashboard (メインページ)
- 📋 Tasks Database (タスク管理)
- 📝 Content Database (コンテンツ制作)
- 📅 Calendar Database (スケジュール)
- 🧠 Memory Database (メモリ・ドキュメント)
- 👥 Team Database (チーム・エージェント)

### 2. 自動同期設定
```bash
npm run missioncontroller:setup
```

**設定されるもの:**
- ⏰ 1時間毎のcron job
- 📝 同期ログファイル
- 🔄 自動データ同期

### 3. 手動同期（テスト用）
```bash
npm run missioncontroller:sync
```

## 📊 Notionでの確認方法

### アクセス場所
1. **Notion**: Personal Home
2. **新しいページ**: 🎯 MissionController Dashboard
3. **5つのデータベース**: Tasks, Content, Calendar, Memory, Team

### データベース詳細

#### 📋 Tasks Database
| 項目 | 内容 |
|------|------|
| Task | タスク名 |
| Status | To Do, In Progress, Review, Done, Blocked |
| Priority | Urgent, High, Medium, Low |
| Assignee | 担当者 |
| Due Date | 期限 |
| Description | 詳細 |

#### 📝 Content Database  
| 項目 | 内容 |
|------|------|
| Title | コンテンツ名 |
| Stage | Ideas, Scripting, Thumbnail, Filming, Editing, Published |
| Type | Blog Post, Video, Social Media, Documentation |
| Due Date | 期限 |
| Script | スクリプト内容 |
| Files | ファイル情報 |

#### 📅 Calendar Database
| 項目 | 内容 |
|------|------|
| Event | イベント名 |
| Date | 日時 |
| Type | Meeting, Task, Deadline, Cron Job, Personal |
| Location | 場所 |
| Status | Scheduled, Confirmed, Cancelled, Completed |

#### 🧠 Memory Database
| 項目 | 内容 |
|------|------|
| Title | ドキュメント名 |
| Type | Note, Reference, Archive, Active |
| Category | Technical, Business, Personal, Research |
| Content | 内容 |
| File Path | ファイルパス |

#### 👥 Team Database
| 項目 | 内容 |
|------|------|
| Name | メンバー名 |
| Role | 役割 |
| Status | Active, Busy, Idle, Offline |
| AI Model | Claude Opus, Sonnet, GLM-4, DeepSeek, GPT-4 |
| Success Rate | 成功率 |

## 🔄 同期の仕組み

### データフロー
```
MissionController (Convex) 
    ↓ 1時間毎
Sync Script (Node.js)
    ↓ Notion API
Notion Databases
    ↓ 表示
Web/Mobile View
```

### 同期内容
1. **完全置換**: 古いデータを削除
2. **最新データ追加**: Convexから最新データを取得
3. **ステータス更新**: ダッシュボードに同期時刻表示

## 📝 ログ確認

### 同期ログ
```bash
tail -f /home/kunekune/mission-control-dashboard/scripts/missioncontroller-sync.log
```

### cron status
```bash
crontab -l | grep missioncontroller
```

## 🛠️ トラブルシューティング

### 同期が動かない場合
```bash
# 手動実行でエラー確認
cd /home/kunekune/mission-control-dashboard/scripts
node full-missioncontroller-sync.js

# ログ確認
tail -20 missioncontroller-sync.log
```

### データベースが作成されない場合
```bash
# 初期化を再実行
npm run missioncontroller:init
```

### cron jobが動かない場合
```bash
# cron再設定
npm run missioncontroller:setup
```

## 🎯 利用開始

1. **セットアップ**: `npm run missioncontroller:init` + `npm run missioncontroller:setup`
2. **Notion確認**: Personal Home > MissionController Dashboard
3. **自動同期**: 1時間後にデータが表示される
4. **モバイル**: NotionアプリでもOK

## ✨ メリット

- ☁️ **クラウドアクセス**: どこからでも確認可能
- 📱 **モバイル対応**: Notionアプリで閲覧
- 👥 **共有可能**: チームメンバーと共有
- 📊 **ダッシュボード**: 全データを一元管理
- 🔄 **自動更新**: 手動操作不要
- 📝 **履歴保存**: データの変更履歴

---

**最終更新**: 2026-02-19
**ステータス**: 実装完了 🎉