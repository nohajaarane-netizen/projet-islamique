# 🌙 NOUR Backend

**NOUR** (نور) — Backend API for the Islamic Spiritual Companion web application.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Clone repository
git clone <repo-url>
cd nour-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 📁 Project Structure

```
nour-backend/
├── src/
│   ├── config/          # Environment, DB, Redis
│   ├── controllers/     # HTTP request handlers
│   ├── jobs/            # BullMQ queues & workers
│   ├── middleware/      # Auth, validation, i18n, rate limiting
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helpers (prayer calc, qibla math, etc.)
│   ├── websockets/      # Socket.io handlers
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` — Register new user
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/refresh` — Refresh token
- `GET /api/v1/auth/profile` — Get profile
- `PUT /api/v1/auth/profile` — Update profile

### Prayer Times
- `GET /api/v1/prayer-times/daily` — Daily prayer times
- `GET /api/v1/prayer-times/monthly` — Monthly timetable
- `GET /api/v1/prayer-times/next` — Next prayer countdown
- `GET /api/v1/prayer-times/notifications` — Notification settings
- `POST /api/v1/prayer-times/notifications` — Update settings

### Salat Tracker
- `GET /api/v1/tracker/today` — Today's prayer status
- `POST /api/v1/tracker/mark` — Mark prayer complete/missed
- `GET /api/v1/tracker/streaks` — Prayer streaks
- `GET /api/v1/tracker/constancy` — 7-day constancy chart
- `GET /api/v1/tracker/heatmap` — Monthly heatmap
- `GET /api/v1/tracker/sunnah` — Sunnah progress
- `GET /api/v1/tracker/badges` — Earned badges

### AsmaUlHusna (99 Names)
- `GET /api/v1/asmaulhusna` — List names with pagination
- `GET /api/v1/asmaulhusna/:id` — Name detail
- `POST /api/v1/asmaulhusna/:id/learn` — Mark as learned
- `POST /api/v1/asmaulhusna/:id/favorite` — Toggle favorite
- `GET /api/v1/asmaulhusna/progress` — Learning progress
- `GET /api/v1/asmaulhusna/daily/today` — Name of the Day

### Hadith & Du'a
- `GET /api/v1/content/hadiths` — List hadiths
- `GET /api/v1/content/hadiths/daily` — Daily hadith
- `GET /api/v1/content/hadiths/:id` — Single hadith
- `GET /api/v1/content/duas` — List duas
- `GET /api/v1/content/duas/daily` — Daily dua
- `GET /api/v1/content/duas/:id` — Single dua
- `GET /api/v1/content/search?q=` — Search content

### Gratitude (Alhamdulillah)
- `POST /api/v1/gratitude` — Create entry
- `GET /api/v1/gratitude/recent` — Recent entries
- `GET /api/v1/gratitude/stats` — Statistics
- `GET /api/v1/gratitude/themes` — Theme cloud
- `GET /api/v1/gratitude/categories` — Categories

### Dhikr Counter
- `POST /api/v1/dhikr` — Increment count
- `GET /api/v1/dhikr/today` — Today's counts
- `GET /api/v1/dhikr/history` — History

### Qibla
- `GET /api/v1/qibla` — Qibla direction
- `GET /api/v1/qibla/location` — Location info

### Weather
- `GET /api/v1/weather` — Current weather + forecast

### Favorites
- `GET /api/v1/favorites` — List favorites
- `POST /api/v1/favorites/:type/:id` — Toggle favorite

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | Required (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `OPENWEATHER_API_KEY` | Weather API key | Optional |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` |

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint
```

## 📜 License

MIT License — NOUR Team
