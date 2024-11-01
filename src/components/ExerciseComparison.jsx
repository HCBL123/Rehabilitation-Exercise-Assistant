
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Card } from './ui/card';
import { Pose } from '@mediapipe/pose';
import { calculatePoseSimilarity } from './PoseComparison';
import { adviceManager } from '../utils/poseAdvice';
import { drawPoseResults } from './PoseDrawing';

// Score Display Component
const ScoreDisplay = ({ score, feedback, advice }) => {
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 mt-4">
      {/* Score Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-medium text-gray-700">Độ chính xác</div>
          <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-2000 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage < 40 ? '#ef4444' :
                percentage < 70 ? '#f59e0b' :
                  '#10b981',
              transition: 'width 2s ease-out, background-color 2s ease-out'
            }}
          />
        </div>
      </div>

      {/* Current Main Advice */}
      {advice && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-lg font-medium text-blue-800 mb-2">
            Hướng dẫn
          </div>
          <div className="text-blue-700">
            {advice}
          </div>
        </div>
      )}

      {/* Detailed Feedback */}
      {feedback && feedback.length > 0 && (
        <div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            Chi tiết điều chỉnh
          </div>
          <div className="space-y-2">
            {feedback.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm border transition-all duration-500
                  ${item.score < 0.4
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : item.score < 0.7
                      ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                      : 'border-green-200 bg-green-50 text-green-700'
                  }`}
              >
                {item.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EnhancedExerciseComparison = ({ exercise }) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [actualScore, setActualScore] = useState(0);
  const [poseFeedback, setPoseFeedback] = useState([]);
  const [currentAdvice, setCurrentAdvice] = useState('');
  const [lastMotionTime, setLastMotionTime] = useState(Date.now());

  // All refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sampleVideoRef = useRef(null);
  const sampleCanvasRef = useRef(null);
  const poseRef = useRef(null);
  const samplePoseRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sampleAnimationFrameRef = useRef(null);
  const isCleanedUpRef = useRef(false);
  const lastPoseResultsRef = useRef(null);
  const lastSamplePoseResultsRef = useRef(null);
  const scoreAnimationRef = useRef(null);
  const scoreHistory = useRef([]);
  const lastScoreUpdateTime = useRef(0);
  const lastPoseRef = useRef(null);

  // Constants for motion detection
  const MOTION_THRESHOLD = 0.01;
  const INACTIVITY_PENALTY_RATE = 15;

  const detectMotionAndUpdateScore = (currentPose, similarity) => {
    const currentTime = Date.now();

    // Check for motion by comparing current pose with last pose
    let hasMotion = false;
    if (lastPoseRef.current) {
      const motionDiff = currentPose.poseLandmarks.reduce((acc, landmark, i) => {
        const lastLandmark = lastPoseRef.current.poseLandmarks[i];
        return acc + Math.abs(landmark.x - lastLandmark.x) + Math.abs(landmark.y - lastLandmark.y);
      }, 0) / currentPose.poseLandmarks.length;

      hasMotion = motionDiff > MOTION_THRESHOLD;
    }

    // Update motion timestamp if motion detected
    if (hasMotion) {
      setLastMotionTime(currentTime);
    }

    // Calculate inactivity duration
    const inactivityDuration = (currentTime - lastMotionTime) / 1000; // in seconds

    // Calculate score with inactivity penalty
    let adjustedScore = similarity.score;
    if (inactivityDuration > 2) { // Start decreasing after 2 seconds of inactivity
      adjustedScore = Math.max(0, adjustedScore - (INACTIVITY_PENALTY_RATE * (inactivityDuration - 2) / 100));
    }

    // Update last pose reference
    lastPoseRef.current = currentPose;

    return adjustedScore;
  };

  // Score animation with trend analysis
  useEffect(() => {
    const animateScore = () => {
      if (isCleanedUpRef.current) return;

      // Update score history
      const currentTime = Date.now();
      if (currentTime - lastScoreUpdateTime.current > 500) {
        scoreHistory.current.push(actualScore);
        if (scoreHistory.current.length > 10) {
          scoreHistory.current.shift();
        }
        lastScoreUpdateTime.current = currentTime;
      }

      // Calculate score trend
      const trend = scoreHistory.current.length > 1
        ? (scoreHistory.current[scoreHistory.current.length - 1] -
          scoreHistory.current[0]) / scoreHistory.current.length
        : 0;

      setDisplayScore(prev => {
        const diff = actualScore - prev;
        // Slower decrease, faster increase for positive trends
        const changeRate = trend > 0 ? 0.15 : 0.05;
        if (Math.abs(diff) < 0.1) return actualScore;
        return prev + diff * changeRate;
      });

      scoreAnimationRef.current = requestAnimationFrame(animateScore);
    };

    scoreAnimationRef.current = requestAnimationFrame(animateScore);

    return () => {
      if (scoreAnimationRef.current) {
        cancelAnimationFrame(scoreAnimationRef.current);
      }
    };
  }, [actualScore, lastMotionTime]);

  // Modify your mainPose.onResults handler
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
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      mainPose.onResults((results) => {
        if (!isCleanedUpRef.current) {
          drawPoseResults(results, canvasRef.current, videoRef.current, true);
          lastPoseResultsRef.current = results;

          if (lastSamplePoseResultsRef.current) {
            const similarity = calculatePoseSimilarity(results, lastSamplePoseResultsRef.current);
            if (similarity) {
              // Apply motion detection and inactivity penalty
              const adjustedScore = detectMotionAndUpdateScore(results, similarity);

              // Update score and feedback
              setActualScore(adjustedScore);
              setPoseFeedback(similarity.feedback);

              // Update advice based on adjusted score and motion state
              const currentTime = Date.now();
              const inactivityDuration = (currentTime - lastMotionTime) / 1000;

              const newAdvice = inactivityDuration > 2
                ? 'Hãy di chuyển theo hướng dẫn trong video'
                : adviceManager.getAdvice(adjustedScore, {
                  leftArmScore: similarity.details?.leftArm?.score,
                  rightArmScore: similarity.details?.rightArm?.score,
                  inactivity: inactivityDuration
                });

              setCurrentAdvice(newAdvice);
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
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      samplePose.onResults((results) => {
        if (!isCleanedUpRef.current) {
          drawPoseResults(results, sampleCanvasRef.current, sampleVideoRef.current, false);
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

      const { mainPose, samplePose } = await initializePoseDetectors();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (sampleVideoRef.current && exercise?.sampleVideo) {
        sampleVideoRef.current.src = exercise.sampleVideo;
        await sampleVideoRef.current.play();
      }

      startDetectionLoop(videoRef.current, mainPose, (frame) => {
        animationFrameRef.current = frame;
      });

      startDetectionLoop(sampleVideoRef.current, samplePose, (frame) => {
        sampleAnimationFrameRef.current = frame;
      });

      setIsRecording(true);
      setFeedback({ type: 'success', message: 'Started! Follow the exercise video.' });

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

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sampleAnimationFrameRef.current) {
      cancelAnimationFrame(sampleAnimationFrameRef.current);
      sampleAnimationFrameRef.current = null;
    }
    if (scoreAnimationRef.current) {
      cancelAnimationFrame(scoreAnimationRef.current);
      scoreAnimationRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (sampleVideoRef.current) {
      sampleVideoRef.current.pause();
      sampleVideoRef.current.src = '';
    }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Feeds */}
        <div className="space-y-6">
          {/* User Camera */}
          <Card className="overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Your Camera</h3>
            </div>
            <div className="relative aspect-video bg-gray-900">
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
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Start Exercise
                  </button>
                </div>
              )}
            </div>

            {/* Score Display below video */}
            {isRecording && (
              <ScoreDisplay
                score={displayScore}
                feedback={poseFeedback}
                advice={currentAdvice}
              />
            )}
          </Card>
        </div>

        {/* Guide Video */}
        <Card className="overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Exercise Guide</h3>
          </div>
          <div className="relative aspect-video bg-gray-900">
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
        <div className="text-center mt-6">
          <button
            onClick={stopExercise}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Stop Exercise
          </button>
        </div>
      )}

      {/* Status Messages */}
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
