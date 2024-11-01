// src/utils/ExercisePerformance.js

class ExercisePerformance {
  constructor() {
    this.startTime = Date.now();
    this.scores = [];
    this.recentScores = []; // For tracking recent performance
    this.peakScore = 0;
    this.repetitions = 0;
    this.lastStableScore = 0;
    this.stabilityThreshold = 5; // seconds
    this.lastStabilityTime = 0;
    this.repetitionThreshold = 0.3; // 30% change for new repetition
    this.areaPerformance = {
      leftArm: [],
      rightArm: []
    };
  }

  updateMetrics(score, details) {
    const currentTime = Date.now();

    // Only consider scores above a minimum threshold (e.g., 10%)
    if (score > 10) {
      this.scores.push({
        score,
        timestamp: currentTime
      });

      // Update peak performance
      this.peakScore = Math.max(this.peakScore, score);

      // Update area-specific performance
      if (details) {
        if (details.leftArm > 0.1) this.areaPerformance.leftArm.push(details.leftArm);
        if (details.rightArm > 0.1) this.areaPerformance.rightArm.push(details.rightArm);
      }

      // Track recent scores for repetition detection
      this.recentScores.push(score);
      if (this.recentScores.length > 10) this.recentScores.shift();

      // Detect repetitions based on score patterns
      this.detectRepetition(score, currentTime);
    }
  }

  detectRepetition(currentScore, currentTime) {
    // Only consider stable scores (maintain similar score for some time)
    if (Math.abs(currentScore - this.lastStableScore) <= 15) {
      if (currentTime - this.lastStabilityTime >= this.stabilityThreshold * 1000) {
        // Check if there was a significant change before stability
        const avgRecentScore = this.recentScores.reduce((a, b) => a + b, 0) / this.recentScores.length;
        if (Math.abs(avgRecentScore - this.lastStableScore) >= this.repetitionThreshold * 100) {
          this.repetitions++;
          this.lastStableScore = currentScore;
        }
      }
    } else {
      this.lastStabilityTime = currentTime;
      this.lastStableScore = currentScore;
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = Math.floor((endTime - this.startTime) / 1000);

    // Filter out very low scores that might be noise
    const validScores = this.scores.filter(s => s.score > 20);

    // Calculate average score with more weight to recent scores
    const recentScoreWeight = 0.7;
    const historicalScoreWeight = 0.3;

    const recentScores = validScores.slice(-Math.min(10, validScores.length));
    const historicalScores = validScores.slice(0, -Math.min(10, validScores.length));

    const recentAverage = recentScores.length > 0
      ? recentScores.reduce((a, b) => a + b.score, 0) / recentScores.length
      : 0;

    const historicalAverage = historicalScores.length > 0
      ? historicalScores.reduce((a, b) => a + b.score, 0) / historicalScores.length
      : 0;

    const weightedAverage = Math.round(
      (recentAverage * recentScoreWeight) +
      (historicalAverage * historicalScoreWeight)
    );

    // Calculate consistency score
    const consistencyScore = this.calculateConsistencyScore(validScores);

    // Calculate area-specific scores
    const areaScores = {
      leftArm: this.calculateAreaScore(this.areaPerformance.leftArm),
      rightArm: this.calculateAreaScore(this.areaPerformance.rightArm)
    };

    // Calculate improvement rate
    const improvementRate = this.calculateImprovementRate(validScores);

    return {
      averageScore: weightedAverage,
      duration: this.formatDuration(duration),
      totalRepetitions: this.repetitions,
      peakPerformance: Math.round(this.peakScore),
      consistencyScore: Math.round(consistencyScore),
      improvementRate,
      areas: {
        leftArm: {
          score: Math.round(areaScores.leftArm * 100),
          message: this.getAreaMessage(areaScores.leftArm)
        },
        rightArm: {
          score: Math.round(areaScores.rightArm * 100),
          message: this.getAreaMessage(areaScores.rightArm)
        }
      }
    };
  }

  calculateConsistencyScore(scores) {
    if (scores.length < 2) return 0;

    // Calculate moving average variance
    const variations = [];
    const windowSize = 5;

    for (let i = windowSize; i < scores.length; i++) {
      const window = scores.slice(i - windowSize, i);
      const avg = window.reduce((a, b) => a + b.score, 0) / windowSize;
      const variance = window.reduce((a, b) => a + Math.pow(b.score - avg, 2), 0) / windowSize;
      variations.push(variance);
    }

    const avgVariation = variations.reduce((a, b) => a + b, 0) / variations.length;
    // Convert variance to a 0-100 score (lower variance = higher consistency)
    return Math.max(0, 100 - (Math.sqrt(avgVariation) * 2));
  }

  calculateAreaScore(scores) {
    if (scores.length === 0) return 0;
    // Use exponential moving average with more weight to recent scores
    const alpha = 0.3;
    return scores.reduce((acc, score, i) => {
      return acc * (1 - alpha) + score * alpha;
    }, scores[0]);
  }

  calculateImprovementRate(scores) {
    if (scores.length < 4) return 0;

    const firstQuarter = scores.slice(0, Math.floor(scores.length / 4));
    const lastQuarter = scores.slice(-Math.floor(scores.length / 4));

    const initialAvg = firstQuarter.reduce((a, b) => a + b.score, 0) / firstQuarter.length;
    const finalAvg = lastQuarter.reduce((a, b) => a + b.score, 0) / lastQuarter.length;

    return Math.round(((finalAvg - initialAvg) / initialAvg) * 100);
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  getAreaMessage(score) {
    if (score >= 0.8) return 'Rất tốt, duy trì phong độ';
    if (score >= 0.6) return 'Tốt, cần giữ ổn định hơn';
    return 'Cần cải thiện độ chính xác';
  }
}

export default ExercisePerformance;
