# DigiKheti Backend API

Node.js + Express + MongoDB backend for the DigiKheti farming assistant application.

## 🏗️ Architecture

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js              # Server entry point
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment configuration
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Crop.js
│   │   ├── PestAlert.js
│   │   ├── Advisory.js
│   │   └── JournalEntry.js
│   ├── routes/                # API route definitions
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│   ├── utils/                 # Helper functions
│   └── seeds/                 # Database seed scripts
├── .env.example               # Environment variables template
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random secret key
   - `LOVABLE_API_KEY`: Your Lovable AI API key (for chatbot)
   - `FRONTEND_URL`: Your frontend URL (default: http://localhost:8081)

4. **Seed the database** (crops data):
   ```bash
   npm run seed
   ```

5. **Start the server**:
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ```

6. **Verify server is running**:
   - Open http://localhost:5000/health
   - You should see: `{"status": "ok", "message": "DigiKheti Backend is running"}`

## 🔑 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `MONGODB_URI` | MongoDB connection string | **Yes** | - |
| `JWT_SECRET` | Secret key for JWT signing | **Yes** | - |
| `JWT_EXPIRES_IN` | JWT token expiration | No | 7d |
| `LOVABLE_API_KEY` | Lovable AI API key | No | - |
| `OPENWEATHER_API_KEY` | OpenWeather API key | No | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:8081 |

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user + profile |
| POST | `/api/auth/logout` | Yes | Logout (client-side token removal) |

**Register/Login Request**:
```json
{
  "email": "farmer@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "email": "farmer@example.com",
    "createdAt": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | Yes | Get user's profile |
| POST | `/api/profile` | Yes | Create profile |
| PUT | `/api/profile` | Yes | Update profile |

**Create/Update Profile Request**:
```json
{
  "name": "Ramesh Kumar",
  "phone": "9876543210",
  "location": "Amritsar, Punjab",
  "pincode": "143001",
  "soilType": "loamy",
  "landSize": 5.5,
  "preferredCrops": ["Wheat", "Rice", "Cotton"]
}
```

---

### Crops

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/crops` | Yes | List all crops |
| GET | `/api/crops?season=kharif` | Yes | Filter by season |
| GET | `/api/crops/:id` | Yes | Get single crop |

**Response**:
```json
{
  "crops": [
    {
      "_id": "...",
      "name": "Rice",
      "season": "kharif",
      "suitableSoil": ["clay", "loamy"],
      "waterRequirement": "High (1200-1500mm)",
      "fertilizerRequirement": "Nitrogen-rich, NPK 4:2:1",
      "expectedYieldRange": "2000-2500 kg/acre",
      "idealTemperatureMin": 20,
      "idealTemperatureMax": 35,
      "rainfallRequirement": "High (1000-2000mm)",
      "description": "Primary food crop, requires flooded fields"
    }
  ],
  "count": 10
}
```

---

### Journal Entries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/journal` | Yes | Get user's journal entries |
| POST | `/api/journal` | Yes | Create journal entry |
| PUT | `/api/journal/:id` | Yes | Update journal entry |
| DELETE | `/api/journal/:id` | Yes | Delete journal entry |

**Create Entry Request**:
```json
{
  "entryType": "sowing",
  "entryDate": "2024-12-16",
  "cropName": "Wheat",
  "notes": "Sowed 2 acres in north field",
  "quantity": "50 kg seeds"
}
```

**Entry Types**: `sowing`, `irrigation`, `fertilizer`, `pest`, `harvest`

---

### Pest Alerts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/alerts` | Yes | Get user's alerts |
| GET | `/api/alerts?isRead=false` | Yes | Get unread alerts |
| POST | `/api/alerts` | Yes | Create alert |
| PUT | `/api/alerts/:id` | Yes | Update alert (mark as read) |

**Create Alert Request**:
```json
{
  "alertType": "pest",
  "severity": "high",
  "title": "Aphid Infestation Detected",
  "description": "Multiple reports of aphids in nearby fields",
  "preventionTips": "Apply neem oil spray",
  "affectedCrops": ["Cotton", "Wheat"]
}
```

---

### Advisories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/advisories` | Yes | Get advisories (user's + public) |
| POST | `/api/advisories` | Yes | Create advisory |

**Response**: Returns both user's own advisories and public advisories

---

### Chat (AI Assistant)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chat` | Yes | Chat with Krishi Saathi AI |

**Request**:
```json
{
  "message": "What fertilizer should I use for wheat?"
}
```

**Response**:
```json
{
  "response": "For wheat cultivation, I recommend using NPK fertilizer in a 4:2:1 ratio..."
}
```

---

### Weather

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/weather` | Yes | Get weather forecast |

**Request**:
```json
{
  "location": "Amritsar, Punjab",
  "pincode": "143001"
}
```

**Response**:
```json
{
  "location": "Amritsar, Punjab",
  "current": {
    "temp": 28,
    "feelsLike": 30,
    "humidity": 65,
    "windSpeed": 12,
    "description": "partly cloudy"
  },
  "forecast": [
    {
      "date": "Tue, Dec 17",
      "tempMax": 32,
      "tempMin": 20,
      "humidity": 60,
      "description": "sunny"
    }
  ],
  "advice": "Based on the forecast, moderate irrigation is recommended..."
}
```

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**How to authenticate**:
1. Register or login via `/api/auth/register` or `/api/auth/login`
2. Save the returned `token`
3. Include in subsequent requests: `Authorization: Bearer {token}`

**Token expiration**: 7 days (configurable via `JWT_EXPIRES_IN`)

---

## 🗄️ Database Schema

### Collections

1. **users** - Authentication data (email, hashed password)
2. **profiles** - Farmer profiles (name, location, soil type, land size)
3. **crops** - Crop reference data (10 pre-seeded crops)
4. **journalentries** - Farming activity log
5. **pestalerts** - Pest/disease warnings
6. **advisories** - Farming tips and government schemes

### Authorization (RLS Equivalent)

- Users can only access their own data (profile, journal, alerts)
- Crops are public (read-only)
- Advisories can be public (userId = null) or user-specific

---

## 🧪 Testing the API

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"farmer@test.com","password":"test123"}'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"farmer@test.com","password":"test123"}'
```

**Get Crops** (with token):
```bash
curl -X GET http://localhost:5000/api/crops \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman/Thunder Client

1. Import the endpoints
2. Create an environment variable for `token`
3. Use `{{token}}` in Authorization headers

---



---

## 🚀 Deployment

### Recommended Platforms

- **Railway** (easiest): `railway init` → `railway up`
- **Heroku**: Deploy via Git
- **DigitalOcean App Platform**
- **AWS EC2/ECS**
- **Google Cloud Run**

### Environment Setup

1. Create MongoDB Atlas cluster
2. Set production environment variables
3. Deploy backend
4. Update frontend `VITE_API_URL` to deployed backend URL

---

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed crops data to database

---

## 🛡️ Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT authentication
- ✅ Input validation on all endpoints
- ✅ CORS configured for frontend URL only
- ✅ Helmet.js security headers
- ✅ MongoDB injection protection via Mongoose

---

## 📧 Support

For issues or questions:
- Check MongoDB connection string
- Verify JWT_SECRET is set
- Check CORS settings match frontend URL
- Review server logs for errors

---

## 📄 License

MIT
