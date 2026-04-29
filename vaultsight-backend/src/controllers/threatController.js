const Threat = require('../models/Threat');
const { searchSimilarThreats } = require('../services/vectorService');
const { generateEmbedding } = require('../services/embeddingService');

const getAllThreats = async (req, res, next) => {
  try {
    const threats = await Threat.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: threats });
  } catch (error) {
    next(error);
  }
};

const semanticSearch = async (req, res, next) => {
  try {
    const { query, limit, riskLevelFilter } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const embedding = await generateEmbedding(query);
    if (!embedding) {
      return res.status(500).json({ success: false, error: 'Failed to generate query embedding' });
    }

    const results = await searchSimilarThreats(embedding, limit || 5, riskLevelFilter);

    const formattedResults = results.map(r => {
      const score = typeof r.similarityScore === 'number' ? r.similarityScore : 0;
      
      let userName = 'Unknown Identity';
      if (r.user && r.user.name) {
        userName = r.user.name;
      } else if (r.affectedUserId && r.affectedUserId.name) {
        userName = r.affectedUserId.name;
      }

      return {
        ...r,
        similarityScore: (score * 100).toFixed(2) + '%',
        userName
      };
    });

    res.status(200).json({ success: true, data: formattedResults });
  } catch (error) {
    next(error);
  }
};

const getThreatStats = async (req, res, next) => {
  try {
    const totalThreats = await Threat.countDocuments();
    const criticalThreats = await Threat.countDocuments({ riskLevel: 'CRITICAL' });
    const highThreats = await Threat.countDocuments({ riskLevel: 'HIGH' });

    const riskDistribution = await Threat.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
    ]);

    const dist = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    riskDistribution.forEach(r => dist[r._id] = r.count);

    res.status(200).json({
      success: true,
      data: {
        totalThreats, criticalThreats, highThreats,
        riskDistribution: dist
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllThreats, semanticSearch, getThreatStats };
