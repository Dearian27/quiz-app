import classNames from "classnames";
import React, { ComponentPropsWithoutRef, FC } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {}

const QuizButton: FC<ButtonProps> = ({
  children,
  className,
  onClick,
  ...rest
}) => {
  return (
    <button
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      className={classNames(
        "px-4 py-2 font-bold text-white text-md rounded-md bg-[#4c4cff]",
        className
      )}
    >
      {children}
    </button>
  );
};

export default QuizButton;
