// src/data/exercises.js
export const exercises = [
  {
    id: 1,
    name: "Shoulder Flexibility",
    description: "Gentle shoulder rotations to improve range of motion",
    difficulty: "Easy",
    duration: "5 minutes",
    imageUrl: "/assets/images/shoulder-exercise.jpg",
    samplePoseData: "/assets/sample-poses/shoulder-pose.json",
    sampleVideo: "/assets/videos/vid1.mp4",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Raise arms to shoulder height",
      "Rotate arms in small circles",
      "Hold for 30 seconds"
    ]
  },
  // Add more exercises...
];

export const getExerciseById = (id) => {
  return exercises.find(exercise => exercise.id === parseInt(id));
};