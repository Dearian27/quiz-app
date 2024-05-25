"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  QuestionContext,
  VariantParams,
  QuestionParams,
} from "@/app/components/QuestionVariants/QuestionProvider";
import toast from "react-hot-toast";
import QuestionVariants, {
  isInputQuestionParams,
} from "@/app/components/QuestionVariants";
import classNames from "classnames";
import { MdAdd } from "react-icons/md";
import { MdOutlineTimerOff } from "react-icons/md";
import { RiTimerLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { QuizParams } from "@/app/page";

export type QuestionTypeVariants = "radio" | "checkbox" | "input";

const CreateQuiz = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [quiz, setQuiz] = useState<Array<QuestionParams>>(null!);

  const [addTimer, setAddTimer] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addNewQuestion = useCallback((type: QuestionTypeVariants) => {
    setQuiz((prev: any[]) => {
      const item =
        type === "input"
          ? {
              type: "input",
              id: 0,
              points: 1,
              text: "",
              answer: "",
            }
          : {
              type: type,
              id: 0,
              points: 1,
              text: "",
              variants: [{ isRight: false, text: "" }],
            };

      if (!prev || !prev?.length) return [item];

      const maxId = prev.reduce(
        (acc, next) => (next.id > acc ? next.id : acc),
        0
      );
      item.id = maxId + 1;
      return [...prev, item];
    });
  }, []);
  const deleteQuestion = useCallback((id: number) => {
    setQuiz((prev) => {
      if (!prev) return [];
      return prev.filter((question) => question.id != id);
    });
  }, []);
  const deleteVariant = useCallback((questionId: number, variantId: number) => {
    setQuiz((prev) => {
      return prev.map((question) => {
        if (question.id === questionId && !isInputQuestionParams(question)) {
          const updatedVariants = question.variants.filter(
            (_, index) => index !== variantId
          );
          return { ...question, variants: updatedVariants };
        }
        return question;
      });
    });
  }, []);
  const addVariant = useCallback((id: number) => {
    setQuiz((prev) => {
      if (!prev?.length) return prev;

      return prev.map((question) => {
        if (question?.id === id && !isInputQuestionParams(question)) {
          return {
            ...question,
            variants: [...question?.variants, { isRight: false, text: "" }],
          };
        }
        return question;
      });
    });
  }, []);
  const updateVariant = useCallback(
    (questionId: number, variantIndex: number, text: string) => {
      setQuiz((prev) =>
        prev.map((question) => {
          if (question.id === questionId && !isInputQuestionParams(question)) {
            const updatedVariants = question.variants.map((variant, index) =>
              index === variantIndex ? { ...variant, text } : variant
            );
            return { ...question, variants: updatedVariants };
          }
          return question;
        })
      );
    },
    []
  );
  const updateVariantQuestion = useCallback(
    (questionId: number, text: string) => {
      setQuiz((prev) =>
        prev.map((question) => {
          if (question.id === questionId) {
            return { ...question, text: text };
          }
          return question;
        })
      );
    },
    []
  );
  const setRightVariant = useCallback(
    (
      value: boolean,
      questionId: number,
      variantId: number,
      currType: QuestionTypeVariants
    ) => {
      setQuiz((prev) => {
        if (!prev?.length) return prev;
        let arr: QuestionParams[] = null!;
        if (currType === "radio" && value === true) {
          arr = prev.map((q) => {
            if (questionId === q.id) {
              if (isInputQuestionParams(q)) return q;
              const variants: VariantParams[] = q.variants.map((v) => {
                v.isRight = false;
                return v;
              });
              return { ...q, variants };
            }
            return q;
          });
          return arr.map((question) => {
            if (question?.id === questionId) {
              if (isInputQuestionParams(question)) return question;
              question.variants[variantId].isRight = value;
            }
            return question;
          });
        }
        return prev.map((question) => {
          if (question.id === questionId) {
            if (isInputQuestionParams(question)) return question;
            question.variants[variantId].isRight = value;
          }
          return question;
        });
      });
    },
    []
  );
  const changePoints = useCallback(
    (id: number, event: ChangeEvent<HTMLInputElement>) => {
      setQuiz((prev: any) => {
        return prev.map((questions: QuestionParams) => {
          if (questions.id === id) {
            let { value, min, max } = event.target;
            const result: number = Math.max(
              Number(min),
              Math.min(Number(max), Number(value))
            );
            return { ...questions, points: result };
          }
          return questions;
        });
      });
    },
    []
  );

  const checkData = () => {
    // more than one variant of answers (except the wordNTranslate Type)
    if (!quiz?.length) {
      toast.error("Додайте запитання");
      return;
    }
    if (quiz?.length < 2) {
      toast.error("Додайте більше ніж 1 запитання");
      return;
    }

    let isError = false;

    quiz.map((question) => {
      if (isError) {
        return;
      }
      if (isInputQuestionParams(question)) {
        if ((!question.answer || !question.text) && !isError) {
          isError = true;
          toast.error("Please fill in all required fields");
          return;
        }
      } else {
        if (!question.text && !isError) {
          isError = true;
          toast.error("Please fill in all required fields");
          return;
        } else if (question.variants.length <= 1 && !isError) {
          isError = true;
          toast.error("You need to have at least 2 answer options");
          return;
        }
        question.variants.map((variant) => {
          if (!variant.text && !isError) {
            isError = true;
            toast.error("Please fill in all required fields");
            return;
          }
        });
        if (!question.variants.find((v) => v.isRight === true) && !isError) {
          isError = true;
          toast.error("Please add at least one right option");
          return;
        }
      }
    });
    if ((!title || !description) && !isError) {
      toast.error("Please fill in all required fields");
      isError = true;
    }
    if (addTimer) {
      if (seconds + minutes * 60 < 60) {
        toast.error("Minimum 60 seconds timer required");
        isError = true;
      }
    }
    if (isError) return;
    sendData();
  };

  const sendData = async () => {
    const data = quiz.map((q) => {
      const { id, ...others } = q;
      return others;
    });
    try {
      let storageQuizes = await JSON.parse(
        localStorage.getItem("quizes") || "[]"
      );
      if (isEdit) {
        storageQuizes = storageQuizes.map((quizItem: QuizParams) => {
          if (quizItem.id == Number(params.id)) {
            return {
              questions: data,
              time: addTimer ? seconds + minutes * 60 : undefined,
              title,
              description,
              id: Number(params.id),
            };
          }
          return quizItem;
        });
      } else {
        const uniqueId =
          storageQuizes.reduce(
            (acc: number, next: QuestionParams) =>
              acc < next.id ? next.id : acc,
            0
          ) + 1;
        storageQuizes.push({
          questions: data,
          time: addTimer ? seconds + minutes * 60 : undefined,
          title,
          description,
          id: uniqueId,
        });
      }
      localStorage.setItem("quizes", JSON.stringify(storageQuizes));
      toast.success("Test created successfully");
      router.push("/");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  const updateInputText = (id: number, value: string) => {
    setQuiz((prev) => {
      return prev.map((question) => {
        if (question.id === id) {
          return { ...question, answer: value };
        }
        return question;
      });
    });
  };
  const handleTimeChange = (
    event: ChangeEvent<HTMLInputElement>,
    state: "seconds" | "minutes"
  ) => {
    let { value, min, max } = event.target;
    const result: number = Math.max(
      Number(min),
      Math.min(Number(max), Number(value))
    );
    if (state === "seconds") {
      setSeconds(result);
    } else if (state === "minutes") {
      setMinutes(result);
    }
  };

  useEffect(() => {
    const currentQuiz = JSON.parse(
      localStorage.getItem("quizes") || "[]"
    )?.find((item: any) => item?.id == Number(params?.id));
    if (currentQuiz) {
      setDescription(currentQuiz.description);
      setTitle(currentQuiz.title);
      setQuiz(currentQuiz.questions);
      setIsEdit(true);
      setAddTimer(currentQuiz.time);
      setMinutes(Math.floor(currentQuiz.time / 60));
      setSeconds(currentQuiz.time % 60);
    }
  }, []);

  return (
    <QuestionContext.Provider
      value={{
        questions: quiz,
        addVariant,
        addNewQuestion,
        deleteQuestion,
        updateVariant,
        setRightVariant,
        deleteVariant,
        updateVariantQuestion,
        updateInputText,
        changePoints,
      }}
    >
      <div className="pt-24 min-h-[100vh] w-[100%] justify-stretch box-border grid gap-4 grid-rows-[auto_1fr_auto]">
        <div className="flex gap-4 items-center h-10">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            className="px-4 py-2 text-xl rounded-md"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Description"
            className="px-4 py-2 text-xl rounded-md"
          />
          <button
            onClick={() => setAddTimer((prev) => !prev)}
            className="h-11 w-11 bg-white rounded-md flex items-center justify-center"
          >
            {addTimer ? (
              <RiTimerLine color="#64e41f" size={"2rem"} />
            ) : (
              <MdOutlineTimerOff color="#ff411f" size={"2rem"} />
            )}
          </button>
          {addTimer && (
            <section className="flex items">
              {/* <span className="p-1 font-bold rounded-md text-3xl mr-2">
              Timer:
            </span> */}
              <input
                className="p-2 font-bold rounded-md w-14 text-3xl"
                maxLength={2}
                max={59}
                type="number"
                value={minutes}
                onChange={(e) => handleTimeChange(e, "minutes")}
              />
              <span className="p-1 font-bold rounded-md text-4xl">:</span>
              <input
                className="p-2 font-bold rounded-md w-14 text-3xl"
                value={seconds}
                onChange={(e) => handleTimeChange(e, "seconds")}
                max={59}
                maxLength={2}
                type="number"
              />
            </section>
          )}
        </div>
        <div>
          {quiz?.length && (
            <div className={"w-[100%] flex flex-col gap-4"}>
              {quiz?.map((question, index) => {
                return (
                  <QuestionVariants
                    index={index}
                    key={`${question.id}${index}`}
                    question={question}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className={"flex items-center gap-4 py-4 justify-between"}>
          <section className="flex gap-2 rounded-lg px-3 py-2 bg-white ">
            <div
              className={classNames(
                "flex gap-1 items-center  pr-3 py-1 pl-2 rounded-md text-lg transition cursor-pointer select-none border-4 border-[#4c4cff] text-[#4c4cff] font-bold"
              )}
              onClick={() => {
                addNewQuestion("radio");
              }}
            >
              <MdAdd size={"1.5rem"} />
              Radio button
            </div>
            <div
              className={classNames(
                "flex gap-1 items-center pr-3 py-1 pl-2 rounded-md text-lg transition cursor-pointer select-none border-4 border-[#4c4cff] text-[#4c4cff] font-bold"
              )}
              onClick={() => {
                addNewQuestion("checkbox");
              }}
            >
              <MdAdd size={"1.5rem"} />
              Checkbox
            </div>
            <div
              className={classNames(
                "flex gap-1 items-center pr-3 py-1 pl-2 rounded-md text-lg  transition cursor-pointer select-none border-4 border-[#4c4cff] text-[#4c4cff] font-bold"
              )}
              onClick={() => {
                addNewQuestion("input");
              }}
            >
              <MdAdd size={"1.5rem"} />
              Input
            </div>
          </section>

          <button
            onClick={checkData}
            className={
              "py-2 px-5 rounded-md bg-[#4c4cff] text-[white] text-lg items-center font-bold flex gap-2"
            }
          >
            {isEdit ? "Змінити" : "Створити"}
          </button>
        </div>
      </div>
    </QuestionContext.Provider>
  );
};

export default CreateQuiz;
