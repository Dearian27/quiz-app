import classNames from "classnames";
import React, { ComponentPropsWithoutRef, FC } from "react";

interface DescriptionProps extends ComponentPropsWithoutRef<"p"> {}

const QuizDescription: FC<DescriptionProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <p {...rest} className={classNames("text-lg font-mono", className)}>
      {children}
    </p>
  );
};

export default QuizDescription;
