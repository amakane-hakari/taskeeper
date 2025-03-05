# Frontend Architecture Guidelines

## アーキテクチャの概要

このプロジェクトは、保守性と再利用性を重視したコンポーネント設計を採用しています。コンポーネントは主に2つのディレクトリに分類されます。

### components/

再利用可能な純粋なUIコンポーネントを配置します：

- ✅ **配置すべきもの**：
  - プレゼンテーショナルコンポーネント
  - 状態管理（Redux等）に依存しないコンポーネント
  - 他のプロジェクトでも再利用可能なコンポーネント
  - Props経由でデータを受け取るコンポーネント
  
- 🚫 **配置すべきでないもの**：
  - ビジネスロジックを含むコンポーネント
  - Reduxストアに直接アクセスするコンポーネント
  - APIコールを直接行うコンポーネント

- **例**：
  ```
  components/
  ├── layouts/        # レイアウト関連（Header, Footer等）
  ├── navigation/     # ナビゲーション関連
  ├── buttons/        # ボタンコンポーネント
  ├── forms/          # フォーム関連コンポーネント
  └── common/         # その他の共通コンポーネント
  ```

### features/

特定の機能やドメインに紐づいたコンポーネントを配置します：

- ✅ **配置すべきもの**：
  - 特定の機能に紐づいたコンテナコンポーネント
  - ビジネスロジックを含むコンポーネント
  - Reduxのスライスやサガ
  - APIとの通信を行うコンポーネント

- 🚫 **配置すべきでないもの**：
  - 汎用的なUIコンポーネント
  - 複数の機能で共通して使用されるコンポーネント

- **例**：
  ```
  features/
  ├── dashboard/      # ダッシュボード機能
  │   ├── Dashboard.tsx
  │   ├── DashboardChart.tsx
  │   └── dashboardSlice.ts
  ├── counter/        # カウンター機能
  │   ├── Counter.tsx
  │   ├── counterSlice.ts
  │   └── counterSaga.ts
  └── ui/            # UI全体の状態管理
      └── uiSlice.ts
  ```

## ベストプラクティス

1. **依存関係の方向**：
   - `features/` → `components/` の方向の依存は許可
   - `components/` → `features/` の方向の依存は禁止

2. **状態管理**：
   - Reduxストアへのアクセスは `features/` 内のコンポーネントでのみ行う
   - `components/` のコンポーネントは必要なデータをprops経由で受け取る

3. **ファイル構成**：
   - 各機能ディレクトリには関連するコンポーネント、スタイル、テスト、状態管理を配置
   - 共通のユーティリティやヘルパー関数は `utils/` ディレクトリに配置

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
