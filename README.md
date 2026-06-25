# Creator Card API

A Node.js + Express + MongoDB API for managing creator cards.

Built using the Resilience17 backend template.

## Live URL

```bash
https://node-assessment-433q.onrender.com
```

---

## Endpoints

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/creator-cards`       | Create a creator card      |
| GET    | `/creator-cards/:slug` | Get a creator card         |
| DELETE | `/creator-cards/:slug` | Soft delete a creator card |

---

## Project Structure

```bash
models/creator-card.js
repository/creator-card/index.js
messages/creator-card.js
services/creator-cards/
endpoints/creator-cards/
```

---

## Local Setup

Clone the repository:

```bash
git clone https://github.com/kemsguy7/node-assessment.git
cd node-assessment
```

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Add:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri
APP_BASE_URL=http://localhost:3000
APP_NAME=creator-card-api
PINO_LOG_LEVEL=info
```

Run locally:

```bash
npm run dev
```

Server runs on:

```bash
http://localhost:3000
```

---

## Testing Endpoints

### Create Creator Card

Local:

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

Production:

```bash
curl -X POST https://node-assessment-433q.onrender.com/creator-cards \
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

Local:

```bash
curl http://localhost:3000/creator-cards/george-cooks
```

Production:

```bash
curl https://node-assessment-433q.onrender.com/creator-cards/george-cooks
```

---

### Delete Creator Card

Local:

```bash
curl -X DELETE http://localhost:3000/creator-cards/george-cooks \
-H "Content-Type: application/json" \
-d '{
  "creator_reference":"crt_8f2k1m9x4p7w3q5z"
}'
```

Production:

```bash
curl -X DELETE https://node-assessment-433q.onrender.com/creator-cards/george-cooks \
-H "Content-Type: application/json" \
-d '{
  "creator_reference":"crt_8f2k1m9x4p7w3q5z"
}'
```

---

## Deploying

### Render

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Environment variables:

```env
MONGODB_URI=your_mongodb_atlas_uri
APP_NAME=creator-card-api
PINO_LOG_LEVEL=info
```

---

### Heroku

Create app:

```bash
heroku create creator-card-api
```

Set config:

```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set APP_NAME=creator-card-api
heroku config:set PINO_LOG_LEVEL=info
```

Deploy:

```bash
git push heroku main
```

---

## Features

- VSL validation
- Slug auto-generation
- Slug uniqueness check
- Public/private access control
- Soft delete support
- Error code mappings
- API responses use `id` instead of `_id`
