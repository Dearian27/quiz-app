"use client";
import QuizCard from "./components/QuizCard";
import Header from "./components/Header";
import { useRouter } from "next/navigation";

type QuestionType = "radio" | "checkbox" | "input";

const quizes = [
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
  const router = useRouter();

  return (
    <main>
      <Header />
      <div className=" min-h-fit gap-6 gap-x-8 py-12 w-[1200px] mx-auto grid grid-cols-3 items-stretch">
        {quizes?.map((quiz) => {
          return (
            <QuizCard key={quiz.id}>
              <QuizCard.Title>{quiz.title}</QuizCard.Title>
              <QuizCard.Description>{quiz.description}</QuizCard.Description>
              <QuizCard.QuestionsCount>
                {quiz.questions?.length || 0} questions
              </QuizCard.QuestionsCount>
              <QuizCard.Button onClick={() => router.push("/quiz/1")}>
                Розпочати
              </QuizCard.Button>
            </QuizCard>
          );
        })}
      </div>
    </main>
  );
}
