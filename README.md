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

## System Workflow (How It Works)

VaultSight AI operates as a unified platform integrating standard banking operations with an intelligent, multi-layered security engine:

1. **User Activity & Transactions**: Users interact with the React frontend to perform daily banking tasks such as viewing balances and transferring funds.
2. **Context-Aware Risk Engine**: Before processing any transfer, the Node.js backend calculates a dynamic Risk Score. This engine evaluates multi-factor criteria including transaction size, geographic location, device fingerprint, and time of day.
3. **AI Vector Embedding**: If an anomaly or high-risk activity is detected, the transaction's metadata is formulated into a semantic description and sent to the Python Embedding Service. Utilizing the `all-MiniLM-L6-v2` transformer model, this text is converted into a dense 384-dimensional vector.
4. **MongoDB Vector Search**: The vector is then queried against a MongoDB Atlas Vector Search index. This enables the system to find semantically similar past threats or known fraudulent patterns, moving beyond simple keyword matching.
5. **Autonomous Threat Mitigation (Auto-Lock)**: Should the system detect a critical risk (e.g., `Risk Score > 75` or unusually large amounts), it instantly intervenes. The transaction is halted, the account is locked (`isLocked = true`), and a critical alert is flagged to prevent further loss.
6. **Admin SOC Dashboard**: Security administrators utilize the real-time SOC (Security Operations Center) dashboard to monitor the network. They can investigate flagged threats, view semantic matches to historical data, and securely unlock false-positive accounts via manual override.

## Technologies Used

- **Frontend**: React (Vite), Tailwind CSS, Axios for API communication.
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT) for secure authentication.
- **AI/ML Service**: Python, FastAPI, `sentence-transformers` for embedding generation.
- **Database**: MongoDB Atlas (Core Database & Vector Search Index).

# VaultSight_AI
