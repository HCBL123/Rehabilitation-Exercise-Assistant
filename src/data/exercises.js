// src/data/exercises.js
export const exercises = [
  {
    id: 1,
    name: "Phục hồi vai gáy",
    description: "Bài tập di chuyển tay lên xuống để hồi phục vai",
    difficulty: "Dễ",
    duration: "5 phút",
    imageUrl: "/assets/images/shoulder-exercise.jpg",
    samplePoseData: "/assets/sample-poses/shoulder-pose.json",
    sampleVideo: "/assets/videos/vid1.mp4",
    instructions: [
      "Đứng thẳng người",

      "Đưa hai tay ra phía trước",

      "Nâng một cánh tay lên",

      "Hạ xuống và năng cánh tay kia lên"
    ]
  },
  {
    id: 2,
    name: "Phục hồi vai gáy",
    description: "Bài tập di chuyển tay lên xuống để hồi phục vai",
    difficulty: "Dễ",
    duration: "5 phút",
    imageUrl: "/assets/images/shoulder-exercise.jpg",
    samplePoseData: "/assets/sample-poses/shoulder-pose.json",
    sampleVideo: "/assets/videos/vid2.mp4",
    instructions: [
      "Đứng thẳng người",

      "Đưa hai tay ra phía trước",

      "Nâng một cánh tay lên",

      "Hạ xuống và năng cánh tay kia lên"
    ]
  },
  // Add more exercises...
];

export const getExerciseById = (id) => {
  return exercises.find(exercise => exercise.id === parseInt(id));
};
