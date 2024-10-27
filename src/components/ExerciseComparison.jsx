import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Card } from './ui/card';
import { Pose } from '@mediapipe/pose';

const EnhancedExerciseComparison = ({ exercise }) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(0);
  const [poseFeedback, setPoseFeedback] = useState([]);
  
  // Video and Canvas refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sampleVideoRef = useRef(null);
  const sampleCanvasRef = useRef(null);
  
  // Pose detection refs
  const poseRef = useRef(null);
  const samplePoseRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sampleAnimationFrameRef = useRef(null);
  const isCleanedUpRef = useRef(false);
  const lastPoseResultsRef = useRef(null);
  const lastSamplePoseResultsRef = useRef(null);

  const calculatePoseSimilarity = (userPose, samplePose) => {
    if (!userPose?.poseLandmarks || !samplePose?.poseLandmarks) return null;

    const keyPointPairs = [
      { name: 'Left Shoulder', indices: [11], threshold: 0.1 },
      { name: 'Right Shoulder', indices: [12], threshold: 0.1 },
      { name: 'Left Elbow', indices: [13], threshold: 0.15 },
      { name: 'Right Elbow', indices: [14], threshold: 0.15 },
      { name: 'Left Wrist', indices: [15], threshold: 0.2 },
      { name: 'Right Wrist', indices: [16], threshold: 0.2 },
      { name: 'Left Hip', indices: [23], threshold: 0.1 },
      { name: 'Right Hip', indices: [24], threshold: 0.1 },
    ];

    let totalScore = 0;
    const feedback = [];

    keyPointPairs.forEach(({ name, indices, threshold }) => {
      const userPoint = userPose.poseLandmarks[indices[0]];
      const samplePoint = samplePose.poseLandmarks[indices[0]];

      if (userPoint.visibility > 0.5 && samplePoint.visibility > 0.5) {
        const distance = Math.sqrt(
          Math.pow(userPoint.x - samplePoint.x, 2) +
          Math.pow(userPoint.y - samplePoint.y, 2)
        );

        const pointScore = Math.max(0, 1 - distance / threshold);
        totalScore += pointScore;

        if (pointScore < 0.7) {
          const xDiff = userPoint.x - samplePoint.x;
          const yDiff = userPoint.y - samplePoint.y;
          
          let direction = '';
          if (Math.abs(xDiff) > Math.abs(yDiff)) {
            direction = xDiff > 0 ? 'left' : 'right';
          } else {
            direction = yDiff > 0 ? 'up' : 'down';
          }

          feedback.push({
            part: name,
            score: pointScore,
            message: `Move your ${name.toLowerCase()} ${direction}`
          });
        }
      }
    });

    const normalizedScore = (totalScore / keyPointPairs.length) * 100;
    return {
      score: Math.round(normalizedScore),
      feedback: feedback.sort((a, b) => a.score - b.score).slice(0, 3)
    };
  };

  const drawPoseResults = (results, canvas, videoElement) => {
    if (!canvas || !videoElement || isCleanedUpRef.current) return;

    const canvasCtx = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      // Draw connections
      canvasCtx.strokeStyle = '#00FF00';
      canvasCtx.lineWidth = 3;

      const connections = [
        [11, 12], // shoulders
        [11, 13], [13, 15], // left arm
        [12, 14], [14, 16], // right arm
        [11, 23], [12, 24], // torso sides
        [23, 24], // hip line
      ];

      connections.forEach(([i, j]) => {
        const start = results.poseLandmarks[i];
        const end = results.poseLandmarks[j];

        if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
          canvasCtx.beginPath();
          canvasCtx.moveTo(start.x * canvas.width, start.y * canvas.height);
          canvasCtx.lineTo(end.x * canvas.width, end.y * canvas.height);
          canvasCtx.stroke();
        }
      });

      // Draw landmarks
      results.poseLandmarks.forEach((landmark) => {
        if (landmark.visibility > 0.5) {
          canvasCtx.fillStyle = '#FF0000';
          canvasCtx.beginPath();
          canvasCtx.arc(
            landmark.x * canvas.width,
            landmark.y * canvas.height,
            5,
            0,
            2 * Math.PI
          );
          canvasCtx.fill();
        }
      });
    }

    canvasCtx.restore();
  };

  const initializePoseDetectors = async () => {
    try {
      const mainPose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
        }
      });

      await mainPose.initialize();
      mainPose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      mainPose.onResults((results) => {
        if (!isCleanedUpRef.current) {
          drawPoseResults(results, canvasRef.current, videoRef.current);
          lastPoseResultsRef.current = results;

          // Calculate similarity if we have both poses
          if (lastSamplePoseResultsRef.current) {
            const similarity = calculatePoseSimilarity(results, lastSamplePoseResultsRef.current);
            if (similarity) {
              setSimilarityScore(similarity.score);
              setPoseFeedback(similarity.feedback);
            }
          }
        }
      });

      const samplePose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
        }
      });

      await samplePose.initialize();
      samplePose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      samplePose.onResults((results) => {
        if (!isCleanedUpRef.current) {
          drawPoseResults(results, sampleCanvasRef.current, sampleVideoRef.current);
          lastSamplePoseResultsRef.current = results;
        }
      });

      poseRef.current = mainPose;
      samplePoseRef.current = samplePose;

      return { mainPose, samplePose };
    } catch (error) {
      console.error('Error initializing pose detectors:', error);
      throw error;
    }
  };

  const startDetectionLoop = async (video, pose, setAnimationFrame) => {
    if (!video || !pose || isCleanedUpRef.current) return;

    try {
      if (video.readyState === 4) {
        await pose.send({ image: video });
      }
      if (!isCleanedUpRef.current) {
        setAnimationFrame(requestAnimationFrame(() => startDetectionLoop(video, pose, setAnimationFrame)));
      }
    } catch (error) {
      if (!isCleanedUpRef.current) {
        console.error('Detection loop error:', error);
      }
    }
  };

  const startExercise = async () => {
    try {
      isCleanedUpRef.current = false;
      setFeedback({ type: 'info', message: 'Initializing...' });

      // Initialize pose detectors
      const { mainPose, samplePose } = await initializePoseDetectors();

      // Start webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      // Set up webcam video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Set up and play sample video
      if (sampleVideoRef.current && exercise?.sampleVideo) {
        sampleVideoRef.current.src = exercise.sampleVideo;
        await sampleVideoRef.current.play();
      }

      // Start detection loops for both videos
      startDetectionLoop(videoRef.current, mainPose, (frame) => {
        animationFrameRef.current = frame;
      });
      
      startDetectionLoop(sampleVideoRef.current, samplePose, (frame) => {
        sampleAnimationFrameRef.current = frame;
      });

      setIsRecording(true);
      setFeedback({ type: 'success', message: 'Exercise started!' });

    } catch (error) {
      console.error('Error starting exercise:', error);
      setFeedback({
        type: 'error',
        message: `Failed to start: ${error.message}`
      });
      cleanupResources();
    }
  };

  const cleanupResources = () => {
    isCleanedUpRef.current = true;

    // Cancel animation frames
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sampleAnimationFrameRef.current) {
      cancelAnimationFrame(sampleAnimationFrameRef.current);
      sampleAnimationFrameRef.current = null;
    }

    // Stop webcam
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    // Stop sample video
    if (sampleVideoRef.current) {
      sampleVideoRef.current.pause();
      sampleVideoRef.current.src = '';
    }

    // Clean up pose detectors
    if (poseRef.current) {
      poseRef.current.close();
      poseRef.current = null;
    }
    if (samplePoseRef.current) {
      samplePoseRef.current.close();
      samplePoseRef.current = null;
    }

    setIsRecording(false);
  };

  const stopExercise = () => {
    cleanupResources();
    if (exercise?.id) {
      navigate(`/results/${exercise.id}`);
    }
  };

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

 return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Score Display */}
      {isRecording && (
        <div className="mb-6 text-center">
          <div className="text-4xl font-bold mb-2">
            Score: {similarityScore}%
          </div>
          <div className="flex flex-col gap-2">
            {poseFeedback.map((feedback, index) => (
              <div
                key={index}
                className="bg-blue-50 p-2 rounded-lg text-blue-700"
              >
                {feedback.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* User Video Feed */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Your Exercise</h3>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            {!isRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <button
                  onClick={startExercise}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Start Exercise
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Sample Video Feed */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Sample Exercise</h3>
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={sampleVideoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              loop
              playsInline
              muted
            />
            <canvas
              ref={sampleCanvasRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        </Card>
      </div>

      {/* Controls */}
      {isRecording && (
        <div className="text-center">
          <button
            onClick={stopExercise}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Stop Exercise
          </button>
        </div>
      )}

      {/* Feedback Messages */}
      {feedback && (
        <Alert className={`mt-6 ${feedback.type === 'error' ? 'bg-red-50' : 'bg-blue-50'}`}>
          <AlertDescription>
            {feedback.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedExerciseComparison;