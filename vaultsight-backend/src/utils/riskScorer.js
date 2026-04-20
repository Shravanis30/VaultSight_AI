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
