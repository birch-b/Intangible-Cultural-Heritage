# intangible-cultural-heritage

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 分支管理模型
- 主分支（master）：用于发布稳定版本的代码，通常只有经过严格测试和审核的代码才会合并到这个分支。
- 开发分支（dev）：用于开发新功能和修复bug，确定版本且明确需要发布时合并到 master 分支。
- 功能分支（feature）：每个新功能都会创建一个独立的 feature 分支，从 dev 分支派生出来，当功能开发完成后，将 feature 分支合并回 dev 分支。
- 修复分支（hotfix）：当 master 分支上的代码出现问题时，从 master 分支创建一个 hotfix 分支进行修复。修复完成后，将 hotfix 分支合并回 master 分支和 dev 分支。
- 测试分支（release）：从 dev 分支创建一个 release 分支。在这个分支上进行最后的测试和修复，完成后将其合并到 master 分支和 develop 分支。

### 1、创建并切换到新功能分支（分支名建议如 feature/your-featureName）

```sh
git checkout -b feature/your-featureName
```

### 2、在新功能分支上进行开发和测试后暂存提交

```sh
git add .
git commit -m "时间-添加新功能描述"
```

### 3、合并前更新本地 dev 分支（切换＋拉取）

```sh
git checkout dev
git pull origin dev
```

### 4、合并新功能分支到 dev 分支（如果出现冲突，手动解决后再暂存提交一次）

```sh
git merge feature/your-featureName
```

### 5、将 dev 分支推送到远程仓库

```sh
git push origin dev
```

