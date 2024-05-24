"use client";
import { useContext, createContext } from "react";
import { QuestionTypeVariants } from "../../create/page";
import { QuizParams } from "@/app/page";

export type VariantQuestionTestParams = {
  type: "radio" | "checkbox";
  id: number;
  text: string;
  variants: VariantTestParams[];
};

export type InputTestParams = {
  type: "input";
  id: number;
  text: string;
  userAnswer?: string;
  answer: string;
};

export interface VariantTestParams {
  isRight: boolean;
  checked?: boolean;
  text: string;
}

export type TestParams = VariantQuestionTestParams | InputTestParams;

export interface QuestionContextParams {
  quiz: QuizParams;
  setRightVariant: (
    value: boolean,
    qId: number,
    vId: number,
    type: QuestionTypeVariants
  ) => void;
  updateInputText: (id: number, value: string) => void;
}

export const TestContext = createContext<QuestionContextParams>(null!);

export const useQuestionContext = () => {
  const props = useContext(TestContext);
  if (!props) {
    throw new Error("No ContextParams provided");
  }
  return props;
};
