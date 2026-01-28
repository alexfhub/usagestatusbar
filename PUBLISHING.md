# Публикация расширения

У Cursor **нет отдельного маркетплейса**. Расширения подтягиваются из **VS Code Marketplace** и **OpenVSX**. Чтобы расширение появилось в Cursor, его нужно опубликовать в один или оба этих реестра. Cursor (особенно после перехода на OpenVSX) подхватывает расширения оттуда, иногда с задержкой.

---

## 1. Подготовка package.json

Перед публикацией обязательно измените в `package.json`:

- **`publisher`** — сейчас стоит `"local"`. Замените на ваш **Publisher ID** (латиница, без пробелов, например ваш логин или имя компании). Этот ID будет в URL расширения.
- По желанию добавьте **`repository`**, **`license`**, **`keywords`** — это повышает доверие и поиск.

Пример:

```json
"publisher": "your-username-or-company",
"repository": "https://github.com/your-username/usage-status-bar",
"license": "MIT",
"keywords": ["cursor", "usage", "spending", "status bar"]
```

---

## 2. Вариант A: VS Code Marketplace

Расширения из [marketplace.visualstudio.com](https://marketplace.visualstudio.com/) подхватываются Cursor.

### Шаги

1. **Аккаунт и токен**
   - Зайдите на [Azure DevOps](https://dev.azure.com) и создайте организацию (если ещё нет).
   - **User settings** (иконка пользователя) → **Personal access tokens** → **New Token**.
   - Scope: **Custom defined** → включите **Marketplace** → **Manage**.
   - Создайте токен и скопируйте его.

2. **Установка vsce и публикация**
   ```bash
   npm install -g @vscode/vsce
   cd usage-status-bar
   vsce login your-publisher-id
   ```
   По запросу вставьте Personal Access Token.

3. **Публикация**
   ```bash
   vsce publish
   ```
   Или с указанием токена: `vsce publish -p <YOUR_PAT>`.

4. **Обновления**
   - Меняйте `version` в `package.json` (например, 0.1.0 → 0.1.1).
   - Снова выполните `vsce publish`.

---

## 3. Вариант B: OpenVSX (рекомендуется для Cursor)

Cursor использует OpenVSX как источник расширений. Публикация в [open-vsx.org](https://open-vsx.org/) помогает расширению быстрее и стабильнее появляться в Cursor.

### Шаги

1. **Аккаунт**
   - Зайдите на [open-vsx.org](https://open-vsx.org/).
   - Войдите через **GitHub**.
   - В профиле подпишите **Publisher Agreement** (если ещё не подписан).

2. **Токен**
   - [open-vsx.org/user-settings/tokens](https://open-vsx.org/user-settings/tokens) → **Create New Token**.
   - Скопируйте токен.

3. **Установка ovsx и публикация**
   ```bash
   npm install -g ovsx
   cd usage-status-bar
   ovsx publish -p YOUR_OPENVSX_TOKEN
   ```
   Или задайте переменную окружения: `export OVSX_PAT=YOUR_TOKEN`, затем `ovsx publish`.

4. **Обновления**
   - Меняйте `version` в `package.json`, затем снова `ovsx publish -p YOUR_TOKEN`.

---

## 4. После публикации

- **VS Code Marketplace**: расширение появится на [marketplace.visualstudio.com](https://marketplace.visualstudio.com/) по имени или по ссылке `https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.usage-status-bar`.
- **OpenVSX**: страница расширения — `https://open-vsx.org/extension/YOUR_PUBLISHER/usage-status-bar`.
- В **Cursor** расширение подтягивается из этих реестров; появление и обновления могут идти с задержкой (от минут до часов). Отдельной «публикации в маркетплейс Cursor» нет — только публикация в VS Code Marketplace и/или OpenVSX.

---

## Полезные ссылки

- [Publishing Extensions (VS Code)](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Open VSX Publishing](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
- [Cursor Forum: Extension Marketplace](https://forum.cursor.com/c/how-to/12)
