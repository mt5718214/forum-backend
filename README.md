# README

<p align="left">
  <a  href="https://github.com/mt5718214/forum-front-end-vue">Check Out Front-end Repository</a>
</p>

## Initialize
```
git clone https://github.com/mt5718214/forum-backend.git
cd forum-express
npm install
npx sequelize db:migrate
npx sequelize db:seed:all
npm run dev
```

## User stories

**前台**

* 使用者可以註冊/登入/登出網站
* 使用者可以瀏覽所有餐廳與個別餐廳詳細資料
* 在瀏覽所有餐廳資料時，可以用分類篩選餐廳
* 使用者可以對餐廳留下評論
* 使用者可以收藏餐廳
* 使用者可以查看最新上架的 10 筆餐廳
* 使用者可以查看最新的 10 筆評論
* 使用者可以編輯自己的個人資料
* 使用者可以查看自己評論過、收藏過的餐廳
* 使用者可以追蹤其他的使用者
* 使用者可以查看自己追蹤中的使用者與正在追蹤自己的使用者
* 與其他使用者群聊

|  account   | password  |
|  ----  | ----  |
| user1@example.com  | 12345678 |
| user2@example.com  | 12345678 |

**後台**

* 只有網站管理者可以登入網站後台
* 網站管理者可以在後台管理餐廳的基本資料
* 網站管理者可以在後台管理餐廳分類

|  account   | password  |
|  ----  | ----  |
| root@example.com  | 12345678 |
