# Cybersecurity & Auto-Lock

This document details the core autonomous protection mechanisms built into VaultSight AI, focusing on the real-time risk scoring engine and the Auto-Lock feature.

## Core Component

- **Key File:** `vaultsight-backend/src/utils/riskScorer.js`

## Concept: Autonomous Protection

VaultSight AI operates a proactive, intelligent defense system. Instead of solely relying on manual administrative reviews after a fraudulent transaction occurs, the system utilizes an **Autonomous Protection** model.

At the heart of this is the **Auto-Lock Risk Threshold**. If a transaction's calculated risk score exceeds **75 points**, the system doesn't wait for an admin—it locks the account instantly. This immediate intervention ensures that potentially compromised accounts are neutralized before significant financial loss can occur.

## Technical Detail: Risk Scoring Engine

Every transaction passed through the system is evaluated by the `calculateRiskScore` function, which examines multiple data points (metadata) associated with the transfer. Various risk factors contribute "weight" (points) to the final security score, which is capped at a maximum of 100.

The key risk factors evaluated include:

- **`isWrongPin` (+50 points):** The highest single risk factor. Entering a wrong MPIN strongly indicates unauthorized access attempts and immediately pushes the transaction toward the critical threshold.
- **`amount` (Up to +35 points):** Unusually high transfer amounts trigger alerts. Transfers over ₹1,00,000 add 35 points, while transfers over ₹50,000 add 20 points.
- **`isNewLocation` (+20 points):** Initiating a transaction from a previously unseen geographic location flags potential account takeover.
- **`isNewDevice` (+15 points):** If the system detects a different device fingerprint or browser, it adds weight to the risk score.
- **`isNewBeneficiary` (Flagged):** Sending funds to a newly added or previously unknown beneficiary is flagged for contextual monitoring, though it doesn't automatically add points to prevent excessive false positives on legitimate new transfers.
- **`Night Transfer` (+10 points):** Transactions occurring between 11 PM and 5 AM are flagged. Points are added conditionally to reflect irregular behavioral patterns.

### Threat Levels

Based on the cumulative score, transactions are categorized into the following threat levels:
- **LOW:** Score ≤ 30
- **MEDIUM:** Score 31 - 60
- **HIGH:** Score 61 - 80
- **CRITICAL:** Score > 80

Any transaction pushing the score past the auto-lock threshold (75) triggers the `BLOCKED` status, sets the user's `isLocked` state to `true`, and creates a critical alert. The account remains frozen until an administrator reviews the threat and issues a manual override via the SOC Dashboard.

## Code Implementation

Below is the exact implementation of the Risk Scoring Engine from `vaultsight-backend/src/utils/riskScorer.js`:

```javascript
/**
 * Calculates risk score for a transaction
 */
const calculateRiskScore = (transactionData, lastTransaction, userStats) => {
  let score = 0;
  const flags = [];

  const { amount, isNewDevice, isNewLocation, timestamp, isNewBeneficiary, isWrongPin } = transactionData;
  const hour = new Date(timestamp).getHours();

  // 1. Amount thresholds
  if (amount > 100000) {
    score += 35;
    flags.push('HIGH_AMOUNT');
  } else if (amount > 50000) {
    score += 20;
    flags.push('MEDIUM_AMOUNT');
  }

  // 2. Beneficiary logic - Points should NOT mark if sending to new user
  if (isNewBeneficiary) {
    flags.push('NEW_BENEFICIARY');
    // No points added for new beneficiary as per request
  }

  // 3. PIN Anomaly - MARK and FLAG if wrong
  if (isWrongPin) {
    score += 50; // Increased to ensure it triggers flag/lock
    flags.push('WRONG_MPIN');
  }

  // 4. Device anomaly - MARK and FLAG
  if (isNewDevice) {
    score += 15;
    flags.push('NEW_DEVICE');
  }

  // 5. Location anomaly - MARK and FLAG
  if (isNewLocation) {
    score += 20;
    flags.push('NEW_LOCATION');
  }

  // 6. Night Transfer logic: don't mark MORE if other flags exist
  const isNight = hour >= 23 || hour <= 5;
  if (isNight) {
    flags.push('NIGHT_TRANSFER');
    // only add points if no other security flags (device/location/pin/amount) are present
    if (flags.length === 1 && flags[0] === 'NIGHT_TRANSFER') {
      score += 10;
    }
  }

  // 7. Existing threats
  if (userStats && userStats.hasHighThreats) {
    score += 10;
    flags.push('EXISTING_THREATS');
  }

  // Cap at 100
  score = Math.min(score, 100);

  let level;
  if (score <= 30) level = 'LOW';
  else if (score <= 60) level = 'MEDIUM';
  else if (score <= 80) level = 'HIGH';
  else level = 'CRITICAL';

  return { score, level, flags };
};

module.exports = { calculateRiskScore };
```

### Explanation of the Logic

1. **Initialization**: The function starts with a baseline `score` of `0` and an empty `flags` array to keep track of triggered rules.
2. **Amount Thresholds**: The amount is checked against two limits. A transfer over 1 Lakh adds 35 points (almost half the threshold to auto-lock), while over 50k adds 20 points.
3. **Beneficiary Logic**: Sending money to a new beneficiary creates a contextual flag (`NEW_BENEFICIARY`) but intentionally avoids adding points to limit false positives for standard user behavior.
4. **PIN Anomaly**: Supplying an incorrect MPIN is treated as a highly critical event, adding a massive 50 points to the score. If combined with any other factor (like a large amount), it guarantees an auto-lock.
5. **Contextual Anomalies**: Changing devices (+15) or locations (+20) incrementally builds the risk profile.
6. **Time-Based Heuristics (Night Transfer)**: Transactions during odd hours (11 PM - 5 AM) add 10 points. However, this is only applied if no other flags exist. This prevents over-penalizing users who are legitimately traveling or awake late but whose other metadata checks out.
7. **Scoring Bounds & Level Evaluation**: The total `score` is strictly capped at `100`. Finally, it maps the numerical score to qualitative threat levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) which dictate how the broader system reacts to the transfer.
