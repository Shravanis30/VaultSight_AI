const axios = require('axios');
const winston = require('winston');

const generateEmbedding = async (text) => {
  const serviceUrl = process.env.EMBEDDING_SERVICE_URL || 'http://localhost:8000';
  const url = `${serviceUrl}/embed`;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    winston.warn('Embedding requested for empty text');
    return null;
  }

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.post(url, { text }, {
        timeout: 10000, // 10 seconds timeout for production stability
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data && response.data.embedding) {
        return response.data.embedding;
      }

      throw new Error('Invalid response format from embedding service');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      winston.warn(`Embedding attempt ${attempt} failed: ${errorMessage}`);

      if (attempt < maxAttempts) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  winston.error('All embedding attempts failed. Vector search features will be limited.');
  return null;
};

module.exports = { generateEmbedding };

