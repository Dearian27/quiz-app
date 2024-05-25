"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TestContext, TestParams, VariantTestParams } from "./TestProvider";
import { isInputQuestionParams } from "@/app/components/QuestionVariants";
import { QuestionTypeVariants } from "../../editor/[id]/page";
import classNames from "classnames";
import Modal from "@/app/components/Modal";
import Timer from "@/app/components/Timer";

type QuizPageProps = {
  params: {
    id: string;
  };
};

export type TestQuizParams = {
  id: number;
  title: string;
  description: string;
  time?: number;
  questions: TestParams[];
};

export default function Page({ params }: QuizPageProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [time, setTime] = useState<number>(null!);
  const [results, setResults] = useState<{
    mark: number;
    markArray: Array<[number, number]>;
    rightQuestions: number;
  }>({
    mark: 0,
    markArray: [],
    rightQuestions: 0,
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<TestQuizParams>(null!);
  const [qNumber, setQNumber] = useState(0);

  const submitTest = () => {
    if (!quizStarted) return;
    setQuizStarted(false);
    checkAnswers();
    router.push(`${pathname}?modal=true`);
  };

  const showAnswers = () => {
    router.push(pathname);
  };

  const checkAnswers = () => {
    currentQuiz.questions.map((question) => {
      let isRight = true;
      if (isInputQuestionParams(question)) {
        if (question.answer !== question?.userAnswer) isRight = false;
      } else {
        question.variants.map((variant) => {
          if (variant.checked !== variant.isRight) {
            isRight = false;
          }
        });
      }
      if (isRight) {
        console.log(question.points);
        setResults((prev) => ({
          markArray: [...prev.markArray, [question.points, question.points]],
          mark: prev.mark + question.points,
          rightQuestions: prev.rightQuestions + 1,
        }));
      } else {
        setResults((prev) => ({
          ...prev,
          markArray: [...prev.markArray, [0, question.points]],
        }));
      }
    });
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
    if (!quiz) {
      setLoading(false);
      return;
    }
    const quizInit = {
      ...quiz,
      questions: quiz?.questions.map((question: TestParams) => {
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
    if (quizInit?.time) setTime(quizInit.time);
    setQuizStarted(true);
  };
  const setRightVariant = (
    value: boolean,
    questionId: number,
    variantId: number,
    currType: QuestionTypeVariants
  ) => {
    if (!quizStarted) return;
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
            question.variants[variantId].checked = value;
          }
          return question;
        });
      }
      return { ...prev, questions: arr };
    });
  };
  const updateInputText = (id: number, value: string) => {
    if (!quizStarted) return;
    setCurrentQuiz((prev: any) => {
      return {
        ...prev,
        questions: prev.questions.map((question: TestParams, index: number) => {
          if (index === id) {
            console.log(value);
            return { ...question, userAnswer: value };
          }
          return question;
        }),
      };
    });
  };
  const endQuiz = () => {
    if (quizStarted) {
      submitTest();
    }
  };

  useEffect(() => {
    router.push(pathname);
    fetchData();
  }, []);

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
      <div className="pt-28 min-h-[100vh] w-[100%] justify-stretch box-border  gap-4 ">
        <h2 className="text-3xl font-bold">{currentQuiz.title}</h2>
        <h3 className="text-lg mb-4">
          Question: {qNumber + 1}/{currentQuiz?.questions?.length}
        </h3>
        <div className="border-[white] border-2 bg-white p-5 py-4 rounded-md flex flex-col items-start gap-1 mb-4">
          <h2 className="flex justify-between w-[100%] items-center mb-2">
            <span className="text-2xl font-bold">
              {currentQuiz?.questions?.[qNumber].text}
            </span>
            <span className="text-lg">
              {!quizStarted && <>{results.markArray[qNumber][0]}/</>}
              {currentQuiz?.questions?.[qNumber].points}{" "}
              {currentQuiz?.questions?.[qNumber].points === 1
                ? "бал"
                : currentQuiz?.questions?.[qNumber].points > 1 &&
                  currentQuiz?.questions?.[qNumber].points < 5
                ? "бали"
                : "балів"}
            </span>
          </h2>
          {isInputQuestionParams(currentQuiz?.questions?.[qNumber]) ? (
            <>
              <input
                className="bg-slate-200 rounded-md py-1 px-2 text-lg"
                value={currentQuiz?.questions?.[qNumber]?.userAnswer}
                onChange={(e) => updateInputText(qNumber, e.target.value)}
                placeholder="Answer"
              />
              {!quizStarted && (
                <h2 className="mt-1">
                  Right answer: {currentQuiz?.questions?.[qNumber].answer}
                </h2>
              )}
            </>
          ) : (
            <>
              {currentQuiz?.questions?.[qNumber].variants.map(
                (v: VariantTestParams, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-1 w-[100%] rounded-md border-white border-2 ${
                      !quizStarted && v.isRight ? "bg-green-200" : ""
                    }`}
                  >
                    <input
                      className={"h-5 w-5"}
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
                    <span className={classNames("text-xl")}>{v?.text}</span>
                  </div>
                )
              )}
            </>
          )}
        </div>
        <div className="flex gap-4 justify-between">
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
            {qNumber === currentQuiz.questions.length - 1 && quizStarted ? (
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
                disabled={qNumber === currentQuiz.questions.length - 1}
              >
                Next
              </button>
            )}
            {!quizStarted && (
              <button
                className={
                  "py-1 px-5 rounded-md border-4 border-[#4c4cff] text-[#4c4cff] bg-white text-lg items-center font-bold flex gap-2 disabled:text-gray-400 disabled:border-gray-400"
                }
                onClick={() => router.push("/")}
              >
                Menu
              </button>
            )}
          </div>
          {currentQuiz?.time && (
            <div className="timer">
              <Timer time={time} submitTest={endQuiz} />
            </div>
          )}
        </div>
      </div>
      <Modal className="items-stretch flex flex-col gap-16 p-6">
        <h1 className="text-4xl font-bold self-center">Results</h1>
        <div className="grid grid-cols-[auto_auto] text-lg">
          <span>Mark:</span>
          <span className="justify-self-end">
            {results.mark}/
            {results.markArray.reduce((acc, next) => (acc += next[1]), 0)}
          </span>
          <span>Right answers:</span>
          <span className="justify-self-end">
            {results.rightQuestions}/{currentQuiz.questions.length}
          </span>
          <span>Status:</span>
          <span className={classNames("justify-self-end font-bold")}>
            {(100 * results.mark) /
              results.markArray.reduce((acc, next) => (acc += next[1]), 0) >
            70 ? (
              <span className="text-green-500">success</span>
            ) : (
              <span className="text-red-500">fail</span>
            )}
          </span>
        </div>
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => router.push("/")}
            className="rounded-md border-4 border-[#4c4cff] text-lg px-4 py-2 text-[#4c4cff] font-bold"
          >
            Menu
          </button>
          <button
            onClick={() => showAnswers()}
            className="rounded-md bg-[#4c4cff] text-lg px-4 py-1 text-white font-bold"
          >
            Show answers
          </button>
        </div>
      </Modal>
    </TestContext.Provider>
  );
}
