"use client";
import { QuizParams } from "@/app/page";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  TestContext,
  TestParams,
  VariantQuestionTestParams,
  VariantTestParams,
} from "./TestProvider";
import { isInputQuestionParams } from "@/app/components/QuestionVariants";
import { QuestionTypeVariants } from "../../create/page";
import classNames from "classnames";

type QuizPageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: QuizPageProps) {
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<QuizParams>(null!);
  const [qNumber, setQNumber] = useState(0);
  console.log("currentQuiz", currentQuiz);

  const submitTest = () => {
    toast.success("submit");
  };

  const changeQuestion = (increment: number) => {
    setQNumber((prev) => {
      if (
        (prev === 0 && increment < 0) ||
        (prev === currentQuiz?.questions?.length - 1 && increment > 0)
      )
        return prev;
      return prev + increment;
    });
  };

  const fetchData = async () => {
    const quiz = await JSON.parse(localStorage.getItem("quizes") || "[]")?.find(
      (item: any) => item?.id == Number(params?.id)
    );
    const quizInit = {
      ...quiz,
      questions: quiz.questions.map((question: TestParams) => {
        if (isInputQuestionParams(question)) {
          return { ...question, userAnswer: "" };
        }
        return {
          ...question,
          variants: question.variants.map((v) => ({ ...v, checked: false })),
        };
      }),
    };
    setCurrentQuiz(quizInit);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const setRightVariant = useCallback(
    (
      value: boolean,
      questionId: number,
      variantId: number,
      currType: QuestionTypeVariants
    ) => {
      setCurrentQuiz((prev: any) => {
        let arr: TestParams[] = null!;
        if (currType === "radio" && value === true) {
          arr = prev.questions.map((q: TestParams, index: number) => {
            if (questionId === index) {
              if (isInputQuestionParams(q)) return q;
              const variants: VariantTestParams[] = q.variants.map(
                (v: VariantTestParams) => {
                  v.checked = false;
                  return v;
                }
              );
              return { ...q, variants };
            }
            return q;
          });
          arr = arr.map((question, index: number) => {
            if (index === questionId) {
              if (isInputQuestionParams(question)) return question;
              question.variants[variantId].checked = value;
            }
            return question;
          });
        } else {
          arr = prev.questions.map((question: TestParams, index: number) => {
            if (index === questionId) {
              if (isInputQuestionParams(question)) return question;
              console.log(variantId);
              console.log(question.variants);
              console.log(question.variants[variantId]);
              question.variants[variantId].checked = value;
            }
            return question;
          });
        }
        return { ...prev, questions: arr };
      });
    },
    []
  );
  const updateInputText = (id: number, value: string) => {
    setCurrentQuiz((prev: any) => {
      return {
        ...prev,
        questions: prev.questions.map((question: TestParams) => {
          if (question.id === id) {
            return { ...question, userAnswer: value };
          }
          return question;
        }),
      };
    });
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-[100vh] w-[100%] justify-stretch box-border grid gap-4 grid-rows-[auto_1fr_auto]">
        <span className="text-lg">Loading...</span>
      </div>
    );
  } else if (!currentQuiz) {
    return (
      <div className="pt-24 min-h-[100vh] w-[100%] justify-stretch box-border grid gap-4 grid-rows-[auto_1fr_auto]">
        <span className="text-lg text-red-600">Quiz not found</span>
      </div>
    );
  }

  return (
    <TestContext.Provider
      value={{ quiz: currentQuiz, updateInputText, setRightVariant }}
    >
      <div className="pt-24 min-h-[100vh] w-[100%] justify-stretch box-border  gap-4 ">
        Question: {qNumber}
        <div>
          {currentQuiz?.questions?.[qNumber].type === "input" ? (
            <h1>input</h1>
          ) : (
            currentQuiz?.questions?.[qNumber].variants.map(
              (v: VariantTestParams, index) => (
                <div
                  key={index}
                  className={classNames(
                    // showOutline ? "!border-[red]" : "",
                    "flex items-center justify-between border-[white] border-2"
                  )}
                >
                  <div className="flex items-center gap-1">
                    <input
                      className={"h-4 w-4"}
                      name={`g${currentQuiz?.questions?.[qNumber].id}`}
                      type={
                        currentQuiz?.questions?.[qNumber].type === "checkbox"
                          ? "checkbox"
                          : "radio"
                      }
                      checked={v?.checked}
                      onChange={(e) =>
                        setRightVariant(
                          e.target.checked,
                          qNumber,
                          index,
                          currentQuiz?.questions?.[qNumber].type
                        )
                      }
                    />
                    <span>{v?.text}</span>
                  </div>
                </div>
              )
            )
          )}
        </div>
        <div className="flex gap-4">
          <button
            className={
              "py-1 px-5 rounded-md border-4 border-[#4c4cff] text-[#4c4cff] bg-white text-lg items-center font-bold flex gap-2 disabled:text-gray-400 disabled:border-gray-400"
            }
            onClick={() => changeQuestion(-1)}
            disabled={qNumber === 0}
          >
            Previous
          </button>
          {qNumber === currentQuiz.questions.length - 1 ? (
            <button
              className={
                "py-1 px-5 rounded-md bg-[#4c4cff] text-[white] text-lg items-center font-bold flex gap-2 disabled:bg-gray-400"
              }
              onClick={() => submitTest()}
            >
              Submit
            </button>
          ) : (
            <button
              className={
                "py-1 px-5 rounded-md bg-[#4c4cff] text-[white] text-lg items-center font-bold flex gap-2 disabled:bg-gray-400"
              }
              onClick={() => changeQuestion(1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </TestContext.Provider>
  );
}
