// src/utils/PoseComparison.js
class PoseComparison {
  constructor() {
    this.pose = null;
    this.camera = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.canvasCtx = null;
  }

  async initializePose() {
    try {
      const { Pose } = await import('@mediapipe/pose');
      
      this.pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      this.pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.pose.onResults(this.onResults.bind(this));
    } catch (error) {
      console.error('Error initializing pose:', error);
      throw new Error('Failed to initialize pose detection');
    }
  }

  async initialize(videoElement, canvasElement) {
    try {
      if (!this.pose) {
        await this.initializePose();
      }

      this.videoElement = videoElement;
      this.canvasElement = canvasElement;
      this.canvasCtx = canvasElement.getContext('2d');

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      // Set up video element
      this.videoElement.srcObject = stream;
      await new Promise((resolve) => {
        this.videoElement.onloadedmetadata = () => {
          resolve();
        };
      });
      await this.videoElement.play();

      // Start detection loop
      this.startDetectionLoop();

      return stream;
    } catch (error) {
      console.error('Error initializing camera:', error);
      throw new Error('Failed to access camera');
    }
  }

  startDetectionLoop() {
    if (!this.videoElement || !this.pose) return;

    const detectFrame = async () => {
      try {
        if (this.videoElement.videoWidth > 0 && this.videoElement.videoHeight > 0) {
          await this.pose.send({ image: this.videoElement });
        }
      } catch (error) {
        console.error('Error in detection loop:', error);
      }
      
      if (this.videoElement.readyState === 4) {
        requestAnimationFrame(detectFrame);
      }
    };

    requestAnimationFrame(detectFrame);
  }

  onResults(results) {
    if (!this.canvasCtx || !this.canvasElement) return;

    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    // Draw pose landmarks
    if (results.poseLandmarks) {
      this.drawPoseLandmarks(results.poseLandmarks);
    }

    this.canvasCtx.restore();
  }

  drawPoseLandmarks(landmarks) {
    this.canvasCtx.fillStyle = '#00FF00';
    this.canvasCtx.strokeStyle = '#00FF00';
    this.canvasCtx.lineWidth = 2;

    // Draw landmarks
    landmarks.forEach(landmark => {
      const x = landmark.x * this.canvasElement.width;
      const y = landmark.y * this.canvasElement.height;
      
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(x, y, 4, 0, 2 * Math.PI);
      this.canvasCtx.fill();
    });

    // Draw connections
    this.drawConnections(landmarks);
  }

  drawConnections(landmarks) {
    const connections = [
      // Torso
      [11, 12], [12, 24], [24, 23], [23, 11],
      // Right arm
      [12, 14], [14, 16],
      // Left arm
      [11, 13], [13, 15],
      // Right leg
      [24, 26], [26, 28],
      // Left leg
      [23, 25], [25, 27]
    ];

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];

      if (startPoint && endPoint) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(
          startPoint.x * this.canvasElement.width,
          startPoint.y * this.canvasElement.height
        );
        this.canvasCtx.lineTo(
          endPoint.x * this.canvasElement.width,
          endPoint.y * this.canvasElement.height
        );
        this.canvasCtx.stroke();
      }
    });
  }

  cleanup() {
    if (this.videoElement && this.videoElement.srcObject) {
      const tracks = this.videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }
  }
}

export default PoseComparison;