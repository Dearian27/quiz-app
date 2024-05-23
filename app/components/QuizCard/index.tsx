import React, { ComponentPropsWithoutRef, FC } from "react";
import QuizDescription from "./QuizDescription";
import QuizTitle from "./QuizTitle";
import QuizQuestionsCount from "./QuizQuestionsCount";
import QuizButton from "./QuizButton";

interface QuizCardProps extends ComponentPropsWithoutRef<"div"> {}

const QuizCardComponent: FC<QuizCardProps> = ({ children }) => {
  return (
    <div className="p-4 bg-white  rounded-xl flex flex-col gap-1 justify-between">
      {children}
    </div>
  );
};

const QuizCard = Object.assign(QuizCardComponent, {
  Title: QuizTitle,
  Description: QuizDescription,
  QuestionsCount: QuizQuestionsCount,
  Button: QuizButton,
});

export default QuizCard;
