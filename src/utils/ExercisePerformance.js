// src/utils/ExercisePerformance.js

class ExercisePerformance {
  constructor() {
    this.scores = [];
    this.startTime = Date.now();
    this.repetitions = 0;
    this.peakScore = 0;
    this.lastStableScore = 0;
    this.isInMotion = false;
    this.motionStartTime = null;
    this.areaPerfomance = {
      leftArm: [],
      rightArm: []
    };
  }

  // Detect repetitions based on pose transitions
  updateMotionState(currentScore, threshold = 0.3) {
    const isCurrentlyInMotion = currentScore > threshold;

    if (isCurrentlyInMotion && !this.isInMotion) {
      // Starting a new motion
      this.isInMotion = true;
      this.motionStartTime = Date.now();
    } else if (!isCurrentlyInMotion && this.isInMotion) {
      // Completed a motion
      this.isInMotion = false;
      if (this.motionStartTime && (Date.now() - this.motionStartTime) > 500) {
        this.repetitions++;
      }
    }
  }

  // Update performance metrics with new pose data
  updateMetrics(score, areaScores) {
    this.scores.push(score);
    this.peakScore = Math.max(this.peakScore, score);

    if (areaScores) {
      if (areaScores.leftArm) {
        this.areaPerfomance.leftArm.push(areaScores.leftArm);
      }
      if (areaScores.rightArm) {
        this.areaPerfomance.rightArm.push(areaScores.rightArm);
      }
    }

    this.updateMotionState(score);
  }

  // Calculate consistency score based on standard deviation
  calculateConsistency() {
    if (this.scores.length < 2) return 0;

    const mean = this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
    const variance = this.scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / this.scores.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to a 0-100 score where lower deviation means higher consistency
    return Math.max(0, 100 - (standardDeviation * 20));
  }

  // Calculate improvement rate
  calculateImprovementRate() {
    if (this.scores.length < 6) return 0;

    const firstThird = this.scores.slice(0, Math.floor(this.scores.length / 3));
    const lastThird = this.scores.slice(-Math.floor(this.scores.length / 3));

    const initialAvg = firstThird.reduce((a, b) => a + b, 0) / firstThird.length;
    const finalAvg = lastThird.reduce((a, b) => a + b, 0) / lastThird.length;

    return Math.round(((finalAvg - initialAvg) / initialAvg) * 100);
  }

  // Calculate area-specific performance
  calculateAreaPerformance() {
    const calculateAreaStats = (scores) => {
      if (scores.length === 0) return { score: 0, message: 'Không có dữ liệu' };

      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length * 100;
      const score = Math.round(avgScore);

      let message;
      if (score >= 80) message = 'Rất tốt, duy trì phong độ';
      else if (score >= 60) message = 'Tốt, cần giữ ổn định hơn';
      else message = 'Cần cải thiện độ chính xác';

      return { score, message };
    };

    return {
      leftArm: calculateAreaStats(this.areaPerfomance.leftArm),
      rightArm: calculateAreaStats(this.areaPerfomance.rightArm)
    };
  }

  // Generate final performance report
  generateReport() {
    const duration = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const averageScore = this.scores.length > 0
      ? Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length * 100)
      : 0;

    return {
      averageScore,
      duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      totalRepetitions: this.repetitions,
      peakPerformance: Math.round(this.peakScore * 100),
      consistencyScore: Math.round(this.calculateConsistency()),
      improvementRate: this.calculateImprovementRate(),
      performanceOverTime: this.scores.map(score => Math.round(score * 100)),
      areas: this.calculateAreaPerformance()
    };
  }
}

export default ExercisePerformance;
