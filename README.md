<div align="center">

# 🏋️ Smart-Gym

### AI-Powered Personal Trainer — Your Camera is Your Coach

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?logo=react)](https://reactnative.dev)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-black?logo=expo)](https://expo.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)](https://mongodb.com)
[![TensorFlow](https://img.shields.io/badge/TensorFlow.js-MoveNet-orange?logo=tensorflow)](https://www.tensorflow.org/js)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Smart-Gym turns your smartphone camera into a real-time personal trainer — detecting full-body pose, validating exercise form, counting reps, and tracking your fitness journey. No wearables. No gym equipment. Just your phone.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Pose Detection** | MoveNet Lightning detects 17 body keypoints in real-time via WebGL GPU |
| 🦴 **Live Skeleton Overlay** | Color-coded SVG skeleton drawn directly over the camera feed |
| 📐 **Posture Validation** | Joint angle analysis gives a 0–100 form score per exercise |
| 🔁 **Auto Rep Counting** | Reps counted automatically from posture score transitions |
| 📊 **Per-Joint Metrics** | Real-time breakdown: knee depth, back alignment, elbow stability, etc. |
| 💬 **Live Feedback** | Instant text feedback — "✅ Excellent form!" / "❌ Poor form — reduce weight" |
| 🏃 **5 Exercises Supported** | Squats, Push-ups, Bicep Curls, Deadlift, Lunges |
| 📈 **Progress Dashboard** | Track workouts, streaks, calories, and history |
| 🥗 **Diet Plan** | Personalized nutrition and diet guidance |
| 🤝 **AI Chatbot** | In-app AI fitness assistant |
| 🔐 **Full Auth Flow** | Register, login, OTP verification, forgot/reset password, Google OAuth |

---

## 🏗️ Architecture

```
Smart-Gym/
├── smart-gym/               ← React Native / Expo frontend
│   ├── app/                 ← Expo Router screens
│   │   ├── (tabs)/          ← Tab screens (Home, Workouts, Progress, Diet, AI, Profile)
│   │   ├── workout-screen.tsx   ← Live AI workout tracker
│   │   ├── login.tsx / signup.tsx
│   │   ├── onboarding1-3.tsx
│   │   └── ...
│   └── src/
│       ├── ml/
│       │   ├── poseDetector.js      ← TFHub MoveNet model loader
│       │   ├── postureAnalyzer.js   ← Joint angle calculator + posture scorer
│       │   └── exerciseLibrary.ts   ← Exercise definitions
│       ├── components/
│       │   ├── PoseDetectionView.jsx ← Hidden WebView: TFjs + MoveNet (WebGL)
│       │   └── SkeletonOverlay.jsx   ← SVG skeleton renderer
│       ├── hooks/
│       │   └── usePoseDetection.js  ← React hook for ML inference loop
│       ├── api/
│       │   └── axiosClient.ts       ← Configured API client
│       ├── store/                   ← Zustand global state
│       └── services/                ← Business logic services
│
└── backend/                 ← Node.js + Express + TypeScript API
    └── src/
        ├── server.ts
        ├── models/          ← Mongoose schemas
        ├── controllers/     ← Route handlers
        ├── services/        ← Business logic
        ├── routes/          ← API route definitions
        ├── middleware/      ← Auth, error handling
        └── utils/           ← JWT, password validation
```

---

## 🤖 AI Pose Detection — How It Works

```
┌─────────────────────────────── workout-screen.tsx ────────────────────────────┐
│                                                                                │
│  ┌──────────────────────────────────────────┐                                 │
│  │        CameraView (expo-camera)           │  ← Live camera, full screen    │
│  │        facing="front", animateShutter=off │                                │
│  └──────────────────────────────────────────┘                                 │
│  ┌──────────────────────────────────────────┐                                 │
│  │        SkeletonOverlay (SVG)             │  ← Bones + joints overlay       │
│  │   Green = good form  Orange/Red = fix    │                                 │
│  └──────────────────────────────────────────┘                                 │
│  ┌──────────────────────────────────────────┐                                 │
│  │   PoseDetectionView (1×1 hidden WebView) │  ← ML engine (WebGL GPU)       │
│  │   TFjs from CDN → MoveNet Lightning      │                                 │
│  │   Receives base64 frames every 500ms     │                                 │
│  │   Returns: 17 normalised keypoints       │                                 │
│  └──────────────────────────────────────────┘                                 │
│                                                                                │
│  Flow:  CameraView → takePictureAsync (base64, no flash, no sound)            │
│         → injectJavaScript → WebView MoveNet inference                        │
│         → postMessage → keypoints → postureAnalyzer → score + metrics         │
│         → SkeletonOverlay redraws → UI updates                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Why WebView for ML?**
Running TFjs inside a WebView (browser JS context) gives us:
- ✅ WebGL GPU acceleration (no native TFjs bridge needed)
- ✅ Works in Expo Go — no dev build required
- ✅ Zero Metro bundling conflicts (CDN loads happen at runtime)
- ✅ True 30fps video inference vs periodic snapshot limitations

**MoveNet Output:** `[1, 1, 17, 3]` tensor → `[y_norm, x_norm, confidence]` per joint

---

## 🛠️ Tech Stack

### Frontend
| Library | Version | Purpose |
|---|---|---|
| React Native | 0.81.5 | Core framework |
| Expo SDK | ~54.0.33 | Build & native APIs |
| Expo Router | ~6.0.23 | File-based navigation |
| expo-camera | ^55.0.14 | Live camera feed |
| react-native-webview | latest | Hidden ML execution context |
| react-native-svg | ^15.15.3 | Skeleton overlay rendering |
| TensorFlow.js | 4.22.0 | Pose inference (CDN, WebGL) |
| MoveNet Lightning | via CDN | 17-keypoint body detection |
| React Query | ^5.90.21 | Server state management |
| Zustand | ^5.0.11 | Client state management |
| expo-linear-gradient | ^55.0.8 | UI gradients |
| React Native Reanimated | ~4.1.1 | Animations |

### Backend
| Library | Version | Purpose |
|---|---|---|
| Node.js + Express | latest | REST API server |
| TypeScript | ~5.9.2 | Type safety |
| MongoDB + Mongoose | latest | Database |
| bcryptjs | latest | Password hashing |
| jsonwebtoken | latest | JWT auth |
| nodemon + ts-node | latest | Development server |
| google-auth-library | latest | Google OAuth |
| dotenv | latest | Environment config |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas URI)
- Expo Go app on your phone (iOS or Android)

### 1. Clone the repository
```bash
git clone https://github.com/Shubham062004/Smart-Gym.git
cd Smart-Gym
```

### 2. Backend setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET

npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend setup
```bash
cd smart-gym
npm install --legacy-peer-deps
npx expo start -c
```

Scan the QR code with **Expo Go** on your phone.

---

## ⚙️ Environment Variables

### Backend — `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/smart-gym
JWT_SECRET=your_super_secret_key

# Optional — Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Optional — OTP emails
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
```

---

## 🌐 API Reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login with email + password |
| `POST` | `/auth/google` | Google OAuth login |
| `POST` | `/auth/forgot-password` | Send OTP to email |
| `POST` | `/auth/verify-otp` | Verify OTP code |
| `POST` | `/auth/reset-password` | Reset password with OTP |
| `GET` | `/auth/me` | Get current user (auth required) |

### Workouts
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/workouts` | Get all workouts |
| `POST` | `/workouts/session` | Save completed workout session |
| `GET` | `/workouts/history` | Get session history |

### User & Progress
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users/profile` | Get user profile |
| `PUT` | `/users/profile` | Update user profile |
| `GET` | `/progress` | Get progress stats |
| `POST` | `/progress` | Log progress entry |

### Other
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard` | Get dashboard summary |
| `GET` | `/diet` | Get diet plan |
| `POST` | `/ai/chat` | AI chatbot message |

---

## 📱 App Screens

```
Onboarding (1→2→3)
       ↓
  Login / Signup
   ↓         ↓
Forgot     Google
Password    OAuth
       ↓
   Home (Dashboard)
   ├── Workouts Tab
   │    └── Workout Screen ← AI Pose Detection Live
   ├── Progress Tab
   ├── Diet Plan Tab
   ├── AI Chatbot Tab
   └── Profile Tab
        └── Settings / Edit Profile
```

---

## 📁 Key Source Files

| File | Role |
|---|---|
| `smart-gym/app/workout-screen.tsx` | Core workout AI screen |
| `smart-gym/src/components/PoseDetectionView.jsx` | WebView ML engine |
| `smart-gym/src/components/SkeletonOverlay.jsx` | SVG skeleton renderer |
| `smart-gym/src/ml/postureAnalyzer.js` | Joint angle + posture scoring |
| `smart-gym/src/ml/poseDetector.js` | MoveNet model loader |
| `backend/src/controllers/authController.ts` | Auth logic |
| `backend/src/models/User.ts` | User mongoose schema |
| `backend/src/server.ts` | Express app entry point |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Shubham](https://github.com/Shubham062004)

⭐ Star this repo if you found it useful!

</div>
