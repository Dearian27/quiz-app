"use client";
import { useContext, createContext } from "react";
import { QuestionTypeVariants } from "../../(pages)/quiz/create/page";

export type InputQuestionParams = {
  type: "input";
  id: number;
  text: string;
  answer: string;
};
export type VariantQuestionParams = {
  type: "radio" | "checkbox";
  id: number;
  text: string;
  variants: VariantParams[];
};

export interface VariantParams {
  isRight: boolean;
  text: string;
}

export type QuestionParams = VariantQuestionParams | InputQuestionParams;

export interface QuestionContextParams {
  type: QuestionTypeVariants;
  changeType: (
    newType: QuestionTypeVariants,
    currentType: QuestionTypeVariants
  ) => void;
  questions: Array<QuestionParams>;
  updateVariantQuestion: (id: number, text: string) => void;
  addNewQuestion: (currentType: QuestionTypeVariants) => void;
  deleteQuestion: (id: number) => void;
  deleteVariant: (questionId: number, variantId: number) => void;
  addVariant: (id: number) => void;
  updateVariant: (
    questionId: number,
    variantIndex: number,
    text: string
  ) => void;
  setRightVariant: (
    value: boolean,
    qId: number,
    vId: number,
    type: QuestionTypeVariants
  ) => void;
  updateInputText: (id: number, value: string) => void;
}

export const QuestionContext = createContext<QuestionContextParams>(null!);

export const useQuestionContext = () => {
  const props = useContext(QuestionContext);
  // console.log(props?.questions);
  if (!props) {
    throw new Error("No ContextParams provided");
  }
  return props;
};
