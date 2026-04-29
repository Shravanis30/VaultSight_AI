const Threat = require('../models/Threat');
const { generateEmbedding } = require('./embeddingService');
const winston = require('winston');

const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const searchSimilarThreats = async (queryVector, limit = 5, riskLevelFilter = null) => {
  try {
    const pipeline = [
      {
        $vectorSearch: {
          index: "threat_vector_index",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 50,
          limit: limit,
          ...(riskLevelFilter && { filter: { riskLevel: { $eq: riskLevelFilter } } })
        }
      },
      {
        $addFields: {
          similarityScore: { $meta: "vectorSearchScore" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "affectedUserId",
          foreignField: "_id",
          as: "user"
        }
      },
      { 
        $unwind: { 
          path: "$user", 
          preserveNullAndEmptyArrays: true 
        } 
      }
    ];

    return await Threat.aggregate(pipeline);
  } catch (error) {
    winston.error(`Vector search error: ${error.message}. Falling back to in-memory cosine similarity.`);
    
    // Fallback: simple cosine similarity in memory
    const allThreats = await Threat.find(riskLevelFilter ? { riskLevel: riskLevelFilter } : {}).populate('affectedUserId');
    
    const scoredThreats = allThreats.map(threat => {
      let score = 0;
      if (threat.embedding && Array.isArray(threat.embedding) && threat.embedding.length > 0) {
         try {
           score = cosineSimilarity(queryVector, threat.embedding);
         } catch (e) {
           score = 0;
         }
      }
      return {
        ...threat.toObject(),
        similarityScore: score,
        user: threat.affectedUserId
      };
    });

    scoredThreats.sort((a, b) => b.similarityScore - a.similarityScore);
    return scoredThreats.slice(0, limit);
  }
};

const findSimilarToTransaction = async (transactionDescription) => {
  try {
    const embedding = await generateEmbedding(transactionDescription);
    if (!embedding) return [];
    
    return await searchSimilarThreats(embedding, 3);
  } catch (error) {
    winston.error(`findSimilarToTransaction error: ${error.message}`);
    return [];
  }
};

module.exports = { searchSimilarThreats, findSimilarToTransaction };

