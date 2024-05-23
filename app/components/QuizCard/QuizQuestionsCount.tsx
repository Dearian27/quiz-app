import classNames from "classnames";
import React, { ComponentPropsWithoutRef, FC } from "react";

interface QuestionsCountProps extends ComponentPropsWithoutRef<"p"> {}

const QuizQuestionsCount: FC<QuestionsCountProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <p
      {...rest}
      className={classNames("text-lg text-slate-400 font-mono", className)}
    >
      {children}
    </p>
  );
};

export default QuizQuestionsCount;
