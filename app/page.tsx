"use client";
import QuizCard from "./components/QuizCard";
import Header from "./components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuestionParams } from "./components/QuestionVariants/QuestionProvider";
import { MdDelete, MdEdit } from "react-icons/md";
import { AppContext } from "./components/AppContext";

export type QuizParams = {
  id: number;
  title: string;
  description: string;
  time?: number;
  questions: QuestionParams[];
};

const quizesExample: QuizParams[] = [
  {
    id: 1,
    title: "About all",
    description: "test quiz with random questions",
    questions: [
      {
        points: 5,
        type: "input",
        id: 1,
        text: "What is the capital of France?",
        answer: "Paris",
      },
      {
        points: 10,
        type: "radio",
        id: 2,
        text: "Which of the following is the largest planet in our solar system?",
        variants: [
          {
            isRight: false,
            text: "Earth",
          },
          {
            isRight: false,
            text: "Mars",
          },
          {
            isRight: true,
            text: "Jupiter",
          },
          {
            isRight: false,
            text: "Saturn",
          },
        ],
      },
      {
        points: 15,
        type: "checkbox",
        id: 3,
        text: "Select all the prime numbers from the list below:",
        variants: [
          {
            isRight: true,
            text: "2",
          },
          {
            isRight: true,
            text: "3",
          },
          {
            isRight: false,
            text: "4",
          },
          {
            isRight: true,
            text: "5",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "About all2",
    time: 119,
    description: "About all part 2)",
    questions: [
      {
        points: 7,
        type: "input",
        id: 4,
        text: "Who wrote 'To Kill a Mockingbird'?",
        answer: "Harper Lee",
      },
      {
        points: 12,
        type: "radio",
        id: 5,
        text: "What is the smallest country in the world by area?",
        variants: [
          {
            isRight: false,
            text: "Monaco",
          },
          {
            isRight: false,
            text: "San Marino",
          },
          {
            isRight: true,
            text: "Vatican City",
          },
          {
            isRight: false,
            text: "Liechtenstein",
          },
        ],
      },
      {
        points: 20,
        type: "checkbox",
        id: 6,
        text: "Which of the following are programming languages?",
        variants: [
          {
            isRight: true,
            text: "Python",
          },
          {
            isRight: true,
            text: "Java",
          },
          {
            isRight: false,
            text: "HTML",
          },
          {
            isRight: true,
            text: "C++",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "About all3",
    description: "About all part 3)",
    questions: [
      {
        points: 8,
        type: "input",
        id: 7,
        text: "What is the chemical symbol for gold?",
        answer: "Au",
      },
      {
        points: 10,
        type: "radio",
        id: 8,
        text: "Which planet is known as the Red Planet?",
        variants: [
          {
            isRight: false,
            text: "Venus",
          },
          {
            isRight: true,
            text: "Mars",
          },
          {
            isRight: false,
            text: "Jupiter",
          },
          {
            isRight: false,
            text: "Saturn",
          },
        ],
      },
      {
        points: 15,
        type: "checkbox",
        id: 9,
        text: "Which of the following are prime numbers?",
        variants: [
          {
            isRight: true,
            text: "7",
          },
          {
            isRight: false,
            text: "9",
          },
          {
            isRight: true,
            text: "11",
          },
          {
            isRight: false,
            text: "15",
          },
        ],
      },
    ],
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [quizes, setQuizes] = useState<QuizParams[]>([]);
  const router = useRouter();

  const deleteQuiz = (id: number) => {
    setQuizes((prev) => {
      localStorage.setItem(
        "quizes",
        JSON.stringify(prev.filter((q) => q.id !== id))
      );
      return prev.filter((q) => q.id !== id);
    });
  };

  useEffect(() => {
    const storageQuizes = JSON.parse(localStorage.getItem("quizes") || "[]");
    if (storageQuizes.length > 0) {
      setQuizes(storageQuizes);
    } else {
      localStorage.setItem("quizes", JSON.stringify(quizesExample));
      setQuizes(quizesExample);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ search: search, updateSearchValue: setSearch }}
    >
      <main>
        <Header />
        <div className="min-h-fit gap-6 gap-x-8 py-12 w-[1200px] mx-auto grid grid-cols-3 items-stretch">
          {quizes
            ?.filter((quiz) => quiz.title.includes(search) || !search)
            .map((quiz) => {
              return (
                <QuizCard key={quiz.id}>
                  <QuizCard.Title className="w-[100%] flex justify-between items-center">
                    {quiz.title}
                    <div className="flex gap-2">
                      <MdEdit
                        style={{ cursor: "pointer" }}
                        onClick={() => router.push(`/editor/${quiz.id}`)}
                      />
                      <MdDelete
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteQuiz(quiz.id)}
                      />
                    </div>
                  </QuizCard.Title>
                  <QuizCard.Description>
                    {quiz.description}
                  </QuizCard.Description>
                  <QuizCard.QuestionsCount className="flex justify-between">
                    <span>{quiz.questions?.length || 0} questions</span>
                    {quiz.time && <span>{Math.ceil(quiz.time / 60)} min</span>}
                  </QuizCard.QuestionsCount>
                  <QuizCard.Button
                    onClick={() => router.push(`/quiz/${quiz.id}`)}
                  >
                    Start
                  </QuizCard.Button>
                </QuizCard>
              );
            })}
        </div>
      </main>
    </AppContext.Provider>
  );
}
