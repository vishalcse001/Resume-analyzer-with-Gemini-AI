const requestLog = new Map();

const rateLimiter = (req, res, next) => {
  const userId = req.userId;
  const now = Date.now();
  const lastRequest = requestLog.get(userId);

  if (lastRequest && now - lastRequest < 15000) { // 15 second cooldown
    const waitTime = Math.ceil((15000 - (now - lastRequest)) / 1000);
    return res.status(429).json({ 
      message: `Please wait ${waitTime} seconds before uploading again` 
    });
  }

  requestLog.set(userId, now);
  next();
};

module.exports = rateLimiter;