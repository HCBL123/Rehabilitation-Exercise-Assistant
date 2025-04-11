export const exercises = [
  {
    id: 1,
    name: "Phục hồi vai gáy",
    description: "Bài tập di chuyển tay lên xuống để hồi phục vai",
    difficulty: "Dễ",
    duration: "2 phút",
    imageUrl: "/assets/images/shoulder-exercise.jpg",
    sampleVideo: "/assets/videos/vid1.mp4"
  },

  {
    id: 2,
    name: "Động tác ép tay",
    description: "Bài tập ép tay giúp hồi phục lại phần vai và khuỷu tay",
    difficulty: "Trung bình",
    duration: "3 phút",
    imageUrl: "/assets/images/exercise2.png",
    sampleVideo: "/assets/videos/vid2.mp4"
  },

  {
    id: 3,
    name: "Động tác gập tay",
    description: "Bài tập gập tay giúp hồi phục lại phần khuỷu tay",
    difficulty: "Dễ",
    duration: "1 phút",
    imageUrl: "/assets/images/exercise3.jpg",
    sampleVideo: "/assets/videos/vid3.mp4"
  },

  {
    id: 4,
    name: "Động tác nghiêng người",
    description: "Bài tập nghiêng người giúp phục hồi lại xương sống",
    difficulty: "Khó",
    duration: "1 phút",
    imageUrl: "/assets/images/exercise4.jpeg",
    sampleVideo: "/assets/videos/vid4.mp4"
  }
];

export const getExerciseById = (id) => {
  return exercises.find(exercise => exercise.id === parseInt(id));
};
