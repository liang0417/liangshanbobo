# Contributing

感谢你愿意改进 Personal AI Portfolio。

## 开始之前

- 功能建议和缺陷请先搜索现有 Issue，避免重复讨论。
- 本仓库只接收可复用的模板、组件、文档和示例内容。
- 真实个人资料、未发布文章、密钥和部署凭据不属于公开仓库。

## 本地开发

```bash
npm install
npm run dev
```

提交前必须通过：

```bash
npm run typecheck
npm run build
```

## Pull Request

1. 从 `main` 创建范围单一的分支。
2. 只修改本次需求需要的文件。
3. 说明变更目的、用户影响和验证结果。
4. 不提交 `.env`、令牌、真实个人资料、构建产物或本地缓存。
5. 等待自动检查通过和维护者审查。

较大的界面或架构调整建议先创建 Issue 对齐方向。
