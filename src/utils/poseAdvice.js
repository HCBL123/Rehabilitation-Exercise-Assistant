// src/utils/poseAdvice.js

const POSE_ADVICE = {
  TOO_LOW: 'Hãy nâng tay lên cao hơn một chút',
  TOO_HIGH: 'Hãy hạ tay xuống thấp một chút',
  TOO_WIDE: 'Thu hẹp khoảng cách giữa hai tay lại',
  TOO_NARROW: 'Dang rộng tay ra một chút',
  BEND_ARMS: 'Hãy co cánh tay lại một chút',
  STRAIGHTEN_ARMS: 'Duỗi thẳng cánh tay ra',
  GOOD_POSITION: 'Giữ nguyên tư thế này, rất tốt!',
  ALMOST_THERE: 'Gần đúng rồi, điều chỉnh thêm một chút nữa',
  GETTING_BETTER: 'Đang cải thiện tốt, tiếp tục cố gắng',
  MAINTAIN_POSITION: 'Cố gắng giữ ổn định tư thế',
  LEFT_ARM_HIGHER: 'Nâng tay trái lên cao hơn một chút',
  RIGHT_ARM_HIGHER: 'Nâng tay phải lên cao hơn một chút',
  LEFT_ARM_LOWER: 'Hạ tay trái xuống thấp một chút',
  RIGHT_ARM_LOWER: 'Hạ tay phải xuống thấp một chút',
};

// This helps prevent advice from changing too frequently
class AdviceManager {
  constructor() {
    this.currentAdvice = '';
    this.lastUpdateTime = 0;
    this.updateInterval = 2000; // 2 seconds between advice updates
    this.consistencyCounter = 0;
    this.lastScoreCategory = null;
  }

  getAdvice(score, poseDetails) {
    const currentTime = Date.now();

    // Don't update advice too frequently
    if (currentTime - this.lastUpdateTime < this.updateInterval) {
      return this.currentAdvice;
    }

    let scoreCategory;
    if (score < 40) scoreCategory = 'low';
    else if (score < 70) scoreCategory = 'medium';
    else scoreCategory = 'high';

    // Reset consistency if score category changed
    if (scoreCategory !== this.lastScoreCategory) {
      this.consistencyCounter = 0;
    } else {
      this.consistencyCounter++;
    }
    this.lastScoreCategory = scoreCategory;

    // Generate new advice based on score and pose details
    let newAdvice = '';

    if (score >= 85) {
      newAdvice = POSE_ADVICE.GOOD_POSITION;
    } else if (score >= 70) {
      newAdvice = POSE_ADVICE.ALMOST_THERE;
    } else if (score >= 50) {
      // More specific advice based on pose details
      if (poseDetails?.leftArmScore < poseDetails?.rightArmScore) {
        newAdvice = POSE_ADVICE.LEFT_ARM_HIGHER;
      } else if (poseDetails?.rightArmScore < poseDetails?.leftArmScore) {
        newAdvice = POSE_ADVICE.RIGHT_ARM_HIGHER;
      } else {
        newAdvice = POSE_ADVICE.GETTING_BETTER;
      }
    } else {
      // Basic guidance for low scores
      if (this.consistencyCounter > 2) {
        newAdvice = POSE_ADVICE.MAINTAIN_POSITION;
      } else {
        newAdvice = POSE_ADVICE.TOO_LOW;
      }
    }

    // Update state
    this.currentAdvice = newAdvice;
    this.lastUpdateTime = currentTime;

    return newAdvice;
  }
}

export const adviceManager = new AdviceManager();
export default POSE_ADVICE;
