// src/utils/PoseDrawing.js

export const drawPoseResults = (results, canvas, video, isMainVideo = true) => {
  if (!canvas || !results || !results.poseLandmarks) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw video frame first (if needed)
  if (video) {
    ctx.save();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // Draw pose landmarks
  drawLandmarks(ctx, results.poseLandmarks);
  drawConnectors(ctx, results.poseLandmarks);
};

const drawLandmarks = (ctx, landmarks) => {
  if (!landmarks) return;

  landmarks.forEach((landmark) => {
    const x = landmark.x * ctx.canvas.width;
    const y = landmark.y * ctx.canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'aqua';
    ctx.fill();
  });
};

const drawConnectors = (ctx, landmarks) => {
  if (!landmarks) return;

  // Define connections between landmarks
  const connections = [
    // Upper body
    [11, 12], // shoulders
    [11, 13], // left upper arm
    [13, 15], // left lower arm
    [12, 14], // right upper arm
    [14, 16], // right lower arm

    // Core
    [11, 23], // left torso
    [12, 24], // right torso
    [23, 24], // hips

    // Lower body
    [23, 25], // left thigh
    [25, 27], // left shin
    [24, 26], // right thigh
    [26, 28], // right shin
  ];

  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2;

  connections.forEach(([start, end]) => {
    if (landmarks[start] && landmarks[end] &&
      landmarks[start].visibility > 0.5 &&
      landmarks[end].visibility > 0.5) {

      ctx.beginPath();
      ctx.moveTo(
        landmarks[start].x * ctx.canvas.width,
        landmarks[start].y * ctx.canvas.height
      );
      ctx.lineTo(
        landmarks[end].x * ctx.canvas.width,
        landmarks[end].y * ctx.canvas.height
      );
      ctx.stroke();
    }
  });
};
