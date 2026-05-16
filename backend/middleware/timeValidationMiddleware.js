const checkReportSubmissionTime = (req, res, next) => {
  const now = new Date();
  
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const hours = now.getHours();   // 0-23

  // Check if it is Friday (day 5) and before 7 PM (hour 19)
  // If not Friday OR (if Friday but hour is >= 19) -> throw error
  if (dayOfWeek !== 5 || hours >= 19) {
    res.status(403);
    throw new Error('Reports can only be submitted on Fridays before 7:00 PM server time');
  }

  next();
};

module.exports = { checkReportSubmissionTime };
