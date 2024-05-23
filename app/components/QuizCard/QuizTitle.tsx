import classNames from "classnames";
import React, { ComponentPropsWithoutRef, FC } from "react";

interface TitleProps extends ComponentPropsWithoutRef<"h2"> {}

const QuizTitle: FC<TitleProps> = ({ children, className, ...rest }) => {
  return (
    <h2 {...rest} className={classNames("font-bold text-2xl", className)}>
      {children}
    </h2>
  );
};

export default QuizTitle;
