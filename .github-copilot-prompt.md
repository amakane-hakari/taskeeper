# GitHub Copilot Chat - Taskeeper Project Prompt

## プロジェクト概要

**Taskeeper**は、モダンなタスク管理WebアプリケーションでTDD（テスト駆動開発）を採用しています。

### 技術スタック
```
Frontend: React + Redux Toolkit + TypeScript + Vite + vanilla-extract
Backend:  Hono + TypeScript + Cloudflare Workers + D1 Database
Testing:  Vitest + React Testing Library + Playwright
Design:   Storybook + Atomic Design
```

## 開発原則

### 🔴 Red-Green-Refactor (TDD)
1. **Red**: 失敗するテストを先に書く
2. **Green**: テストを通す最小限のコードを書く  
3. **Refactor**: コードを改善する

### 🏗️ アーキテクチャ原則
- **クリーンアーキテクチャ**: 依存関係は外→内（UI → Domain）
- **Result型**: 例外ではなく値でエラーを表現
- **型安全性**: TypeScript strict mode
- **関心の分離**: Presentational/Container分離

## フロントエンド開発ガイド

### ディレクトリ構造
```
src/
├── components/         # 汎用コンポーネント（Redux非依存）
│   └── <ComponentName>/
│       ├── <ComponentName>.tsx
│       ├── <ComponentName>.css.ts     # vanilla-extract
│       ├── <ComponentName>.test.tsx   # Vitest + RTL
│       ├── stories/<ComponentName>.stories.tsx
│       └── index.ts                   # Public API
│
├── features/           # 機能単位（Redux依存）  
│   └── <feature>/
│       ├── <Feature>Slice.ts         # Redux Toolkit
│       ├── <Feature>Saga.ts          # Redux Saga
│       ├── hooks/use<Feature>.ts     # カスタムフック
│       ├── ui/<Feature>.tsx          # UIコンポーネント
│       └── __tests__/                # テスト
│
├── store/              # Redux設定
├── i18n/               # 多言語化
└── styles/             # テーマ・グローバルスタイル
```

### コーディング規約

#### コンポーネント
```typescript
// ✅ Good: 関数コンポーネント + 明示的Props型
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return <button className={buttonStyles[variant]} onClick={onClick}>{label}</button>;
};
```

#### 状態管理
- **グローバル状態**: Redux Toolkit
- **ローカル状態**: useState/useReducer  
- **API**: RTK Query
- **副作用**: Redux Saga

#### スタイリング
```typescript
// vanilla-extract (.css.ts)
import { style } from '@vanilla-extract/css';

export const buttonStyles = {
  primary: style({
    backgroundColor: 'blue',
    color: 'white',
  }),
};
```

#### テスト
```typescript
// Vitest + React Testing Library
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct label', () => {
    render(<Button label="Click me" onClick={vi.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## バックエンド開発ガイド

### ディレクトリ構造
```
src/
├── routes/             # ルーティング（Hono）
├── domains/            # ビジネスロジック
├── repositories/       # データアクセス層
├── infrastructures/    # 外部サービス連携
└── shared/             # 共通ユーティリティ
```

### レイヤー責務
- **Routes**: HTTP要求/応答の変換
- **Domains**: ビジネスルール・ドメインロジック
- **Repositories**: データアクセスの抽象化
- **Infrastructures**: 外部システム統合

### Result型パターン
```typescript
// ✅ 例外ではなく値でエラー表現
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// ドメインでの使用例
export const createTask = (title: string): Result<Task, TaskError> => {
  if (!title.trim()) {
    return { success: false, error: new TaskError('Title is required') };
  }
  return { success: true, data: new Task(title) };
};
```

### Cloudflare Workers制約
- **メモリ**: 128MB制限
- **CPU時間**: 10-50ms
- **永続化**: D1/KV/Durable Objects
- **コールドスタート**: 最適化必須

## GitHub Copilot Chat 活用パターン

### 🎯 新機能開発
```
@workspace Taskeeperの.clinerulesに従って、タスク編集機能を実装してください。
- TDDサイクルでテストファースト
- Redux Toolkitでの状態管理
- vanilla-extractでスタイリング
- クリーンアーキテクチャ準拠
```

### 🔍 コードレビュー
```
このコードがTaskkeeperプロジェクトの規約に準拠しているかチェックしてください：
- TypeScript strict mode
- Result型エラーハンドリング  
- コンポーネント設計
- テストカバレッジ
```

### 🧪 テスト生成
```
この関数のテストをVitest + React Testing Libraryで作成してください。
TDDのRed-Green-Refactorサイクルに従って実装。
```

### 🎨 Storybook作成
```
このコンポーネントのStorybookストーリーを作成してください。
Atomic Designとvariant設計に基づいて。
```

### 🔧 リファクタリング
```
このコードをクリーンアーキテクチャ原則に従ってリファクタリングしてください：
- 依存関係の向き
- 関心の分離
- 型安全性
```

## 実行コマンド

### 開発環境
```bash
# フロントエンド
cd frontend && npm run dev          # 開発サーバー
npm run test                        # テスト（watch）
npm run test:run                    # テスト（CI）
npm run storybook                   # Storybook

# バックエンド  
cd backend && npm run dev           # Wrangler開発
npm run test:run                    # テスト実行
```

### 品質チェック
```bash
npm run lint                        # ESLint
npm run format                      # Prettier
npm run test:coverage              # カバレッジ
```

## 重要な注意事項

### ❌ 避けるべきパターン
- class構文（関数型を優先）
- 直接的な例外throw（Result型を使用）
- Reduxの直接mutation（Immerを活用）
- グローバルCSS（vanilla-extractを使用）

### ✅ 推奨パターン
- 関数コンポーネント + TypeScript
- Result型でのエラーハンドリング
- テストファースト開発
- 明示的な依存関係注入

---

このプロンプトを参照してTaskkeeperプロジェクトの開発を支援してください。規約に従った高品質なコードの生成をお願いします。
