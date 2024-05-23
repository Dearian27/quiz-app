"use client";
import React, { ChangeEvent, useCallback, useState } from "react";
import {
  QuestionContext,
  VariantParams,
  QuestionParams,
} from "@/app/components/QuestionVariants/QuestionProvider";

import { IoIosAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import QuestionVariants, {
  isInputQuestionParams,
} from "@/app/components/QuestionVariants";
import classNames from "classnames";

export type QuestionTypeVariants = "radio" | "checkbox" | "input";

const CreateQuiz = () => {
  const [type, setType] = useState<QuestionTypeVariants>("radio");
  const [quiz, setQuiz] = useState<Array<QuestionParams>>(null!);

  const [addTimer, setAddTimer] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const addNewQuestion = useCallback((currentType: QuestionTypeVariants) => {
    setQuiz((prev) => {
      const item =
        currentType === "input"
          ? {
              type: "input",
              id: 0,
              text: "",
              answer: "",
            }
          : {
              type: currentType,
              id: 0,
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
        if (question.id === questionId) {
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
          console.log(question);
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
          if (question.id === questionId) {
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
  const changeType = useCallback((newType: QuestionTypeVariants) => {
    setType(newType);
  }, []);
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
    if (type !== "input") {
      let qlError = false;
      // quiz.map((question) => {
      //   if (question?.variants.length < 2) qlError = true;
      // });

      if (qlError) {
        toast.error("Мають бути як мінімум 2 варіанти відповіді");
        return;
      }
    }

    let noWrongAnswer = false;
    let variantsTextError = false;
    quiz.map((q) => {
      if (!q.variants.find((v) => v.isRight === true)) {
        noWrongAnswer = true;
      }
      if (!q.question) variantsTextError = true;
      q.variants.map((v) => {
        if (!v.text) variantsTextError = true;
      });
    });
    if (variantsTextError) {
      toast.error("Заповніть усі запитання та відповіді");
      return;
    }
    if (noWrongAnswer) {
      toast.error("Додайте хоч одну правильну відповідь у запитання");
      return;
    }

    sendData();
  };
  const sendData = async () => {
    const q = quiz.map((q) => {
      return { question: q.text, variants: q?.variants };
    });
    // const data = { questions: q };
    // console.log("data", data);

    try {
      // const res = await axios.post("/api/tests/create", data);
      // console.log(res);
      // if (res.status === 200) {
      //   toast.success("Тест створено успішно");
      //   return;
      // }
      toast.error("Щось пішло не так");
      return;
    } catch (err) {
      toast.error("Щось пішло не так");
      return;
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
    console.log(result);
    if (state === "seconds") {
      setSeconds(result);
    } else if (state === "minutes") {
      setMinutes(result);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        type,
        changeType,
        questions: quiz,
        addVariant,
        addNewQuestion,
        deleteQuestion,
        updateVariant,
        setRightVariant,
        deleteVariant,
        updateVariantQuestion,
        updateInputText,
      }}
    >
      <div className="flex items-center gap-4">
        <section className="flex gap-2 rounded-lg px-3 py-2 bg-white ">
          <div
            className={classNames(
              "px-3 py-1 rounded-md text-lg transition cursor-pointer select-none bg-[#4c4cff] text-white font-bold"
            )}
            onClick={() => {
              changeType("radio");
              addNewQuestion("radio");
            }}
          >
            Radio button
          </div>
          <div
            className={classNames(
              "px-3 py-1  rounded-md text-lg transition cursor-pointer select-none bg-[#4c4cff] text-white font-bold"
            )}
            onClick={() => {
              changeType("checkbox");
              addNewQuestion("checkbox");
            }}
          >
            Checkbox
          </div>
          <div
            className={classNames(
              "px-3 py-1 rounded-md text-lg  transition cursor-pointer select-none, bg-[#4c4cff] text-white font-bold"
            )}
            onClick={() => {
              changeType("input");
              addNewQuestion("input");
            }}
          >
            Input
          </div>
        </section>
        <section>
          <span className="p-1 font-bold rounded-md text-4xl mr-2">Timer:</span>
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
      </div>
      {quiz?.length && (
        <div className={"w-[100%] flex flex-col gap-4"}>
          {quiz?.map((question, index) => {
            return (
              <QuestionVariants
                index={index}
                key={question.id}
                question={question}
              />
            );
          })}
        </div>
      )}
      <div className={"flex gap-4"}>
        <button
          onClick={() => addNewQuestion(type)}
          className={
            "py-2 px-4 rounded-md bg-[#4c4cff] text-white font-bold flex items-center gap-2"
          }
        >
          <IoIosAddCircleOutline size={"1.6rem"} color="white" />
          Нове запитання
        </button>
        <button
          onClick={checkData}
          className={
            "py-2 px-4 rounded-md bg-white border-[#4c4cff] border-4 text-[#4c4cff] items-center font-bold flex gap-2"
          }
        >
          Створити
        </button>
      </div>
    </QuestionContext.Provider>
  );
};

export default CreateQuiz;
