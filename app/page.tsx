"use client";
import QuizCard from "./components/QuizCard";
import Header from "./components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuestionParams } from "./components/QuestionVariants/QuestionProvider";
import { MdDelete, MdEdit } from "react-icons/md";

export type QuizParams = {
  id: number;
  title: string;
  description: string;
  time?: number;
  questions: [QuestionParams];
};

const quizesExample: QuizParams[] = [
  {
    id: 1,
    title: "Quiz1",
    description: "some description",
    questions: [
      {
        text: "question1",
        type: "radio",
        variants: [
          { isRight: false, text: "variant1" },
          { isRight: true, text: "variant2" },
          { isRight: false, text: "variant1" },
        ],
      },
      {
        text: "question2",
        type: "input",
        answer: "question2",
      },
      {
        text: "question3",
        type: "checkbox",
        variants: [
          { isRight: false, text: "javascript is cool" },
          { isRight: true, text: "javascript is not cool" },
          { isRight: true, text: "javascript is not cool" },
          { isRight: true, text: "javascript is not cool" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Quiz2",
    time: 119,
    description: "some description for quiz2 and somethig else",
    questions: [
      {
        text: "question1",
        type: "radio",
        variants: [
          { isRight: false, text: "variant1" },
          { isRight: true, text: "variant2" },
          { isRight: false, text: "variant1" },
        ],
      },
      {
        text: "question2",
        type: "radio",
        variants: [
          { isRight: false, text: "variant4" },
          { isRight: false, text: "variant5" },
          { isRight: true, text: "variant6" },
        ],
      },
      {
        text: "question3",
        type: "radio",
        variants: [
          { isRight: false, text: "variant1" },
          { isRight: false, text: "variant2" },
          { isRight: true, text: "variant1" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Quiz3",
    description: "some description",
    questions: [
      {
        text: "question1",
        type: "radio",
        variants: [
          { isRight: false, text: "variant1" },
          { isRight: true, text: "variant2" },
          { isRight: false, text: "variant1" },
        ],
      },
      {
        text: "question2",
        type: "radio",
        variants: [
          { isRight: false, text: "variant4" },
          { isRight: false, text: "variant5" },
          { isRight: true, text: "variant6" },
        ],
      },
      {
        text: "question3",
        type: "radio",
        variants: [
          { isRight: false, text: "variant1" },
          { isRight: false, text: "variant2" },
          { isRight: true, text: "variant1" },
        ],
      },
    ],
  },
];

export default function Home() {
  const [quizes, setQuizes] = useState<QuizParams[]>([]);
  console.log(quizes);
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
    <main>
      <Header />
      <div className="min-h-fit gap-6 gap-x-8 py-12 w-[1200px] mx-auto grid grid-cols-3 items-stretch">
        {quizes?.map((quiz) => {
          console.log(quiz);
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
              <QuizCard.Description>{quiz.description}</QuizCard.Description>
              <QuizCard.QuestionsCount className="flex justify-between">
                <span>{quiz.questions?.length || 0} questions</span>
                {quiz.time && <span>{Math.ceil(quiz.time / 60)} min</span>}
              </QuizCard.QuestionsCount>
              <QuizCard.Button
                onClick={() => router.push(`/quiz/find/${quiz.id}`)}
              >
                Розпочати
              </QuizCard.Button>
            </QuizCard>
          );
        })}
      </div>
    </main>
  );
}
