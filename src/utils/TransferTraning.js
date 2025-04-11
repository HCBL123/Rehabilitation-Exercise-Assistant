import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

class RehabPoseModel {
  constructor() {
    this.baseModel = null;
    this.transferModel = null;
    this.modelConfig = {
      architecture: 'MobileNetV2',
      outputStride: 16,
      inputResolution: { width: 257, height: 257 },
      multiplier: 0.75,
    };
  }

  async initialize() {
    try {
      // Load base MoveNet model
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        enableSmoothing: true,
        multiPoseMaxDimension: 256,
      };

      this.baseModel = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );

      // Create transfer model architecture
      this.transferModel = tf.sequential({
        layers: [
          // Input layer - expects flattened pose keypoints
          tf.layers.dense({
            inputShape: [51], // 17 keypoints * 3 (x, y, confidence)
            units: 128,
            activation: 'relu',
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
          }),

          // Hidden layers
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({
            units: 64,
            activation: 'relu',
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
          }),

          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: 32,
            activation: 'relu',
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
          }),

          // Output layer - adjust units based on number of exercise classes
          tf.layers.dense({
            units: 10, // Number of exercise classes
            activation: 'softmax'
          })
        ]
      });

      // Compile transfer model
      this.transferModel.compile({
        optimizer: tf.train.adam(0.0001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      return true;
    } catch (error) {
      console.error('Model initialization error:', error);
      throw error;
    }
  }

  async preprocessFrame(videoFrame) {
    try {
      // Get pose estimation from base model
      const poses = await this.baseModel.estimatePoses(videoFrame);

      if (!poses || poses.length === 0) {
        throw new Error('No poses detected');
      }

      // Extract keypoints and flatten them
      const keypoints = poses[0].keypoints;
      const flattenedData = this.flattenKeypoints(keypoints);

      // Convert to tensor
      return tf.tensor2d([flattenedData], [1, 51]);
    } catch (error) {
      console.error('Frame preprocessing error:', error);
      throw error;
    }
  }

  flattenKeypoints(keypoints) {
    // Flatten keypoints into a single array [x1, y1, conf1, x2, y2, conf2, ...]
    const flattened = [];
    keypoints.forEach(keypoint => {
      flattened.push(
        keypoint.x,
        keypoint.y,
        keypoint.score || 0
      );
    });
    return flattened;
  }

  async trainOnExerciseData(trainData, validationData, epochs = 50) {
    try {
      // Prepare training data
      const processedTrainData = await this.prepareTrainingData(trainData);
      const processedValidationData = await this.prepareTrainingData(validationData);

      // Training configuration
      const batchSize = 32;
      const callbacks = [
        tf.callbacks.earlyStopping({
          monitor: 'val_loss',
          patience: 10,
          restoreBestWeights: true
        }),
        {
          onEpochEnd: async (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
          }
        }
      ];

      // Train the model
      const history = await this.transferModel.fit(
        processedTrainData.xs,
        processedTrainData.ys,
        {
          epochs: epochs,
          batchSize: batchSize,
          validationData: [processedValidationData.xs, processedValidationData.ys],
          callbacks: callbacks,
          shuffle: true
        }
      );

      return history;
    } catch (error) {
      console.error('Training error:', error);
      throw error;
    }
  }

  async prepareTrainingData(data) {
    // Process and prepare training data
    const xs = [];
    const ys = [];

    for (const sample of data) {
      try {
        // Process video frame or image
        const inputTensor = await this.preprocessFrame(sample.frame);
        xs.push(inputTensor);

        // Create one-hot encoded label
        const label = tf.oneHot(sample.label, 10); // 10 classes
        ys.push(label);
      } catch (error) {
        console.warn('Error processing training sample:', error);
        continue;
      }
    }

    // Stack all processed samples
    return {
      xs: tf.stack(xs),
      ys: tf.stack(ys)
    };
  }

  async predictExercise(videoFrame) {
    try {
      // Preprocess frame
      const inputTensor = await this.preprocessFrame(videoFrame);

      // Get prediction
      const prediction = this.transferModel.predict(inputTensor);

      // Get highest probability class
      const classIndex = tf.argMax(prediction, 1).dataSync()[0];
      const probability = prediction.max().dataSync()[0];

      // Cleanup
      inputTensor.dispose();
      prediction.dispose();

      return {
        exerciseClass: classIndex,
        confidence: probability
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  async saveModel(modelPath) {
    try {
      await this.transferModel.save(`localstorage://${modelPath}`);
      return true;
    } catch (error) {
      console.error('Model saving error:', error);
      throw error;
    }
  }

  async loadModel(modelPath) {
    try {
      this.transferModel = await tf.loadLayersModel(`localstorage://${modelPath}`);
      return true;
    } catch (error) {
      console.error('Model loading error:', error);
      throw error;
    }
  }

  // Calculate pose similarity for exercise form correction
  calculatePoseSimilarity(userPose, referencePose) {
    try {
      const similarityScores = {};
      const keyPointPairs = [
        ['left_shoulder', 'right_shoulder'],
        ['left_elbow', 'right_elbow'],
        ['left_wrist', 'right_wrist'],
        ['left_hip', 'right_hip'],
        ['left_knee', 'right_knee'],
        ['left_ankle', 'right_ankle']
      ];

      keyPointPairs.forEach(([joint1, joint2]) => {
        const userAngle = this.calculateJointAngle(userPose, joint1, joint2);
        const referenceAngle = this.calculateJointAngle(referencePose, joint1, joint2);

        const similarity = 1 - Math.abs(userAngle - referenceAngle) / 180;
        similarityScores[`${joint1}_${joint2}`] = similarity;
      });

      return similarityScores;
    } catch (error) {
      console.error('Pose similarity calculation error:', error);
      throw error;
    }
  }

  calculateJointAngle(pose, joint1, joint2) {
    const point1 = pose.keypoints.find(kp => kp.name === joint1);
    const point2 = pose.keypoints.find(kp => kp.name === joint2);

    if (!point1 || !point2) return 0;

    const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
    return angle * (180 / Math.PI); // Convert to degrees
  }

  // Memory cleanup
  dispose() {
    if (this.transferModel) {
      this.transferModel.dispose();
    }
    tf.dispose();
  }
}

// Usage example
const initializeRehabModel = async () => {
  const rehabModel = new RehabPoseModel();
  await rehabModel.initialize();

  // Example training data structure
  const trainData = [
    {
      frame: videoFrame,
      label: 0 // exercise class index
    }
  ];

  const validationData = [
  ];

  await rehabModel.trainOnExerciseData(trainData, validationData);

  await rehabModel.saveModel('rehab-pose-model');

  return rehabModel;
};

export default RehabPoseModel;
