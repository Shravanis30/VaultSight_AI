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
# VaultSight_AI
