# VaultSight AI - Backend & Cybersecurity Engine

VaultSight AI is a comprehensive banking and cybersecurity system featuring real-time risk scoring, autonomous account protection (Auto-Lock), and AI-driven threat intelligence using MongoDB Atlas Vector Search.

## Architecture

```
                                      +--------------------------+
                                      |   Python Embedding Svc   |
                                      | (Sentence-Transformers)  |
                                      +------------^-------------+
                                                   |
                                                   | POST /embed
                                                   |
+-------------------+      REST API      +---------v-------------+      Mongoose      +---------------------+
|   React Frontend  | <----------------> |    Node.js Express    | <----------------> |   MongoDB Atlas     |
| (localhost:5173)  |                    |    (localhost:5000)   |                    | (Vector Search Index)|
+-------------------+                    +---------+-------------+                    +---------------------+
                                                   |
                                                   | node-cron
                                                   v
                                         +-----------------------+
                                         |   Security Monitors   |
                                         +-----------------------+
```

## Prerequisites

- **Node.js**: v20 or higher
- **Python**: v3.9 or higher
- **MongoDB Atlas**: Account and Cluster setup

## Quick Start

### 1. Python Embedding Service
```bash
cd python-embedding
pip install -r requirements.txt
python main.py
# Running on http://localhost:8000
```

### 2. Backend Setup
```bash
cd vaultsight-backend
npm install
cp .env.example .env
# Edit .env and add your MONGODB_URI and JWT_SECRET
```

### 3. Database Seeding
```bash
npm run seed
```

### 4. Run Server
```bash
npm run dev
# Running on http://localhost:5000
```

---

## MongoDB Atlas Vector Search Configuration

To enable semantic threat search, you **MUST** create a Vector Search Index on the `threats` collection:

1. Log into MongoDB Atlas.
2. Go to **Atlas Search** in the sidebar.
3. Click **Create Search Index**.
4. Select **Atlas Vector Search (JSON Editor)**.
5. Select the `threats` collection in the `vaultsight_db` database.
6. Use the following index definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "riskLevel"
    }
  ]
}
```

7. Name the index: `threat_vector_index`.
8. Wait for the index to build (status: Active).

---

## Security System (Auto-Lock Flow)

1. **Transaction initiated** via `/api/user/send-money`.
2. **Risk Scorer** evaluates: Amount, Beneficiary, Device, Location, Time.
3. **High/Critical triggers** create a Threat + Alert.
4. **Auto-Lock Trigger**:
   - IF `riskScore > 75` OR `amount > ₹1,00,000`
   - THEN `User.isLocked = true`
   - TRANSACTION status = `BLOCKED`
   - ALERT created (CRITICAL)
5. **Admin Override**: Admin reviews threat, analyzes similarity with vector search, and clicks **Unlock Account**.

---

## API Endpoints

### Auth
- `POST /api/auth/login`: User/Admin authentication
- `GET /api/auth/me`: Get current session profile

### Admin (verifyAdmin)
- `GET  /api/admin/users`: List all bank users
- `POST /api/admin/users`: Register new user (auto-gen credentials)
- `POST /api/admin/unlock/:userId`: Manual override for locked accounts
- `GET  /api/admin/stats`: SOC Dashboard KPIs

### User (verifyToken)
- `GET  /api/user/profile`: Personal details
- `POST /api/user/send-money`: Core transaction entry with risk engine
- `GET  /api/user/transactions`: Personal history

### Threats (verifyAdmin)
- `GET  /api/threats/stats`: Threat intelligence KPIs
- `POST /api/threats/semantic-search`: Vector-similarity search for patterns

---

## Demo Credentials

- **Admin**: `admin` / `Admin@123`
- **User**: `rahul` / `Password@123` (or any seeded user)

# VaultSight AI - Backend & Cybersecurity Engine

VaultSight AI is a comprehensive banking and cybersecurity system featuring real-time risk scoring, autonomous account protection (Auto-Lock), and AI-driven threat intelligence using MongoDB Atlas Vector Search.

## Architecture

```
                                      +--------------------------+
                                      |   Python Embedding Svc   |
                                      | (Sentence-Transformers)  |
                                      +------------^-------------+
                                                   |
                                                   | POST /embed
                                                   |
+-------------------+      REST API      +---------v-------------+      Mongoose      +---------------------+
|   React Frontend  | <----------------> |    Node.js Express    | <----------------> |   MongoDB Atlas     |
| (localhost:5173)  |                    |    (localhost:5000)   |                    | (Vector Search Index)|
+-------------------+                    +---------+-------------+                    +---------------------+
                                                   |
                                                   | node-cron
                                                   v
                                         +-----------------------+
                                         |   Security Monitors   |
                                         +-----------------------+
```

## Prerequisites

- **Node.js**: v20 or higher
- **Python**: v3.9 or higher
- **MongoDB Atlas**: Account and Cluster setup

## Quick Start

### 1. Python Embedding Service
```bash
cd python-embedding
pip install -r requirements.txt
python main.py
# Running on http://localhost:8000
```

### 2. Backend Setup
```bash
cd vaultsight-backend
npm install
cp .env.example .env
# Edit .env and add your MONGODB_URI and JWT_SECRET
```

### 3. Database Seeding
```bash
npm run seed
```

### 4. Run Server
```bash
npm run dev
# Running on http://localhost:5000
```

---

## MongoDB Atlas Vector Search Configuration

To enable semantic threat search, you **MUST** create a Vector Search Index on the `threats` collection:

1. Log into MongoDB Atlas.
2. Go to **Atlas Search** in the sidebar.
3. Click **Create Search Index**.
4. Select **Atlas Vector Search (JSON Editor)**.
5. Select the `threats` collection in the `vaultsight_db` database.
6. Use the following index definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "riskLevel"
    }
  ]
}
```

7. Name the index: `threat_vector_index`.
8. Wait for the index to build (status: Active).

---

## Security System (Auto-Lock Flow)

1. **Transaction initiated** via `/api/user/send-money`.
2. **Risk Scorer** evaluates: Amount, Beneficiary, Device, Location, Time.
3. **High/Critical triggers** create a Threat + Alert.
4. **Auto-Lock Trigger**:
   - IF `riskScore > 75` OR `amount > ₹1,00,000`
   - THEN `User.isLocked = true`
   - TRANSACTION status = `BLOCKED`
   - ALERT created (CRITICAL)
5. **Admin Override**: Admin reviews threat, analyzes similarity with vector search, and clicks **Unlock Account**.

---

## API Endpoints

### Auth
- `POST /api/auth/login`: User/Admin authentication
- `GET /api/auth/me`: Get current session profile

### Admin (verifyAdmin)
- `GET  /api/admin/users`: List all bank users
- `POST /api/admin/users`: Register new user (auto-gen credentials)
- `POST /api/admin/unlock/:userId`: Manual override for locked accounts
- `GET  /api/admin/stats`: SOC Dashboard KPIs

### User (verifyToken)
- `GET  /api/user/profile`: Personal details
- `POST /api/user/send-money`: Core transaction entry with risk engine
- `GET  /api/user/transactions`: Personal history

### Threats (verifyAdmin)
- `GET  /api/threats/stats`: Threat intelligence KPIs
- `POST /api/threats/semantic-search`: Vector-similarity search for patterns

---

## Demo Credentials

- **Admin**: `admin` / `Admin@123`
- **User**: `rahul` / `Password@123` (or any seeded user)

## Viva Talking Points

- **Vector Embeddings**: We use `all-MiniLM-L6-v2` because it generates compact 384-dimensional vectors that capture semantic meaning, unlike keyword matching.
- **Why MongoDB Atlas?**: Having Vector Search built into the database removes the complexity of syncing data with a separate vector DB like Pinecone.
- **Risk Multi-Factor**: The system doesn't just look at balance; it checks geography, device fingerprinting, and behavioral velocity.

## Detailed System Architecture & Workflow

VaultSight AI is not just a banking portal; it is an intelligent, multi-layered cybersecurity platform designed to detect, analyze, and autonomously mitigate financial fraud in real-time. Below is a comprehensive breakdown of how the entire system operates from end to end:

### 1. User Interaction & Core Banking Operations
The system begins at the frontend (React/Vite). Users can log in securely using JSON Web Tokens (JWT) and perform standard banking operations such as checking their balance, viewing transaction history, and most importantly, initiating money transfers. Every transaction request acts as a trigger for the underlying security engine.

### 2. Context-Aware Risk Engine (The First Line of Defense)
When a user attempts a transfer via the `/api/user/send-money` endpoint, the Node.js backend intercepts the request before it executes. It passes the transaction metadata to the `calculateRiskScore` utility. This engine is highly contextual and evaluates multiple vectors:
- **Device & Location Intelligence:** Has the user suddenly switched devices or logged in from a new geographic location? (+15 to +20 Risk Points)
- **Behavioral Velocity:** Is the transaction occurring at 3 AM? Night transfers are flagged for suspicious behavioral velocity. (+10 Risk Points)
- **Financial Thresholds:** Transfers exceeding ₹50,000 or ₹1,00,000 immediately spike the risk score. (+20 to +35 Risk Points)
- **Authentication Anomalies:** A failed MPIN attempt during the session adds a massive +50 points, strongly indicating an account takeover attempt.

This engine outputs a dynamic **Risk Score (0-100)** and categorizes the threat level as LOW, MEDIUM, HIGH, or CRITICAL.

### 3. AI Vector Embedding Generation
If a transaction exhibits high-risk behavior or triggers specific anomaly flags, the backend compiles the transaction's metadata into a natural language "threat description" (e.g., *"Large transfer of ₹1,20,000 from a new device in Mumbai at 2:00 AM with 1 failed PIN attempt"*). 

This description is sent via a POST request to our **Python Embedding Service** running FastAPI. Using the `sentence-transformers` library and the `all-MiniLM-L6-v2` model, this text is converted into a dense, **384-dimensional mathematical vector**. This vector captures the *semantic meaning* of the threat, rather than just performing keyword matching.

### 4. Semantic Threat Intelligence via MongoDB Atlas
The generated 384D vector is immediately stored in **MongoDB Atlas**. Using Atlas's native **Vector Search** capabilities, the system performs a cosine-similarity query against the `threats` collection. 
Instead of asking the database, *"Have we seen this exact transaction before?"*, Vector Search asks, *"Have we seen a pattern of behavior mathematically similar to this?"*. This allows VaultSight AI to identify zero-day fraud tactics by comparing them to historical data, outputting a "Similarity Score" for administrators to review.

### 5. Autonomous Threat Mitigation (Auto-Lock Mechanism)
Speed is critical in cybersecurity. VaultSight AI implements an **Autonomous Protection Model**. If the context-aware risk engine calculates a score exceeding the **Auto-Lock Threshold (75 points)**, the system does not wait for human intervention:
- The transaction is immediately set to `BLOCKED`.
- The user's account is frozen (`isLocked = true`).
- A `CRITICAL` alert is broadcasted to the system.

This guarantees that compromised accounts are neutralized instantly, preventing further unauthorized fund drainage before a human administrator even sees the alert.

### 6. Security Operations Center (SOC) Dashboard
For administrators, the React frontend provides a comprehensive SOC Dashboard. Admins can:
- View real-time KPI metrics (Total Threats, Active Locks, High-Risk Anomalies).
- Monitor the network for flagged transactions.
- Review the semantic similarity of new threats against historical data to understand attack patterns.
- Securely execute a **Manual Override** to unlock false-positive accounts after verifying the legitimate user's identity.

## Technologies Used

- **Frontend Ecosystem**: React.js (built with Vite), Tailwind CSS for rapid styling, and Axios for seamless REST API communication.
- **Backend Architecture**: Node.js & Express.js handling robust routing, Mongoose ODM for database schemas, and JWT/Bcrypt for ironclad authentication.
- **AI & Machine Learning**: Python 3, FastAPI for microservices, and HuggingFace's `sentence-transformers` for generating NLP embeddings.
- **Database & Search Engine**: MongoDB Atlas serving as both the core operational database and the Vector Search Index engine.

# VaultSight_AI
