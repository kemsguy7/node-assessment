# Creator Card API

A REST API for creating, retrieving, and soft-deleting creator cards.

Built with:

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Custom VSL validation layer

## Live API

Production URL:

https://node-assessment-433q.onrender.com

---

## Features

- Create creator cards
- Retrieve creator cards by slug
- Soft delete creator cards
- Auto-generate slugs from titles
- Slug uniqueness validation
- Private/public access control
- Consistent error codes

---

## API Endpoints

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/creator-cards`       | Create a creator card      |
| GET    | `/creator-cards/:slug` | Retrieve a creator card    |
| DELETE | `/creator-cards/:slug` | Soft delete a creator card |

---

## Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/kemsguy7/node-assessment
cd node-template
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

Required env variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
APP_BASE_URL=http://localhost:3000
APP_NAME=creator-card-api
PINO_LOG_LEVEL=info
```

---

## Run locally

```bash
npm start
```

App runs on:

```bash
http://localhost:3000
```

---

## Testing Endpoints Locally

### Create Creator Card

```bash
curl -X POST http://localhost:3000/creator-cards \
-H "Content-Type: application/json" \
-d '{
  "title":"George Cooks",
  "slug":"george-cooks",
  "creator_reference":"crt_8f2k1m9x4p7w3q5z",
  "status":"published"
}'
```

---

### Get Creator Card

```bash
curl http://localhost:3000/creator-cards/george-cooks
```

---

### Delete Creator Card

```bash
curl -X DELETE http://localhost:3000/creator-cards/george-cooks \
-H "Content-Type: application/json" \
-d '{
  "creator_reference":"crt_8f2k1m9x4p7w3q5z"
}'
```

---

## Testing Production API

Replace localhost with:

```bash
https://node-assessment-433q.onrender.com
```

Example:

```bash
curl https://node-assessment-433q.onrender.com/creator-cards/george-cooks
```

---

## Deploying to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Use:

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

---

## Deploying to Heroku

Install Heroku CLI and run:

```bash
heroku create creator-card-api
git push heroku main
```

Set environment variables:

```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set PORT=3000
```

Start app:

```bash
heroku open
```

---

## Business Rules Covered

- Validation errors return `400`
- Duplicate slug returns `SL02`
- Missing creator card returns `NF01`
- Deleted creator card returns `NF01`
- Invalid access control returns `AC01`, `AC03`, `AC04`, `AC05`
- Responses return `id` instead of `_id`

---

## Notes

This project was built as part of a backend assessment and follows the provided template architecture.
