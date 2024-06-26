"use client";
import React, { useState } from "react";
import Variant from "./Variant";
import {
  useQuestionContext,
  VariantParams,
  QuestionParams,
} from "./QuestionProvider";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { InputQuestionParams } from "./QuestionProvider";
import Input from "./Input";
import classNames from "classnames";

export function isInputQuestionParams(
  question: QuestionParams
): question is InputQuestionParams {
  return question.type === "input";
}

const VariantQuestion = ({
  question,
  index,
}: {
  question: QuestionParams;
  index: number;
}) => {
  const { addVariant, deleteQuestion, changePoints, updateVariantQuestion } =
    useQuestionContext();
  const [showOutline, setShowOutline] = useState(false);

  return (
    <div
      className={classNames(
        "w-[100%] border-[white] border-2 bg-white p-3 rounded-lg transition",
        showOutline ? "!border-[red]" : ""
      )}
    >
      <div className="flex justify-between items-center w-[100%]">
        <span>
          <span className="text-lg">{index + 1}.</span>
          <input
            className={"text-lg px-1 outline-none"}
            type="text"
            placeholder={"Question"}
            value={question.text}
            onChange={(e) => updateVariantQuestion(question.id, e.target.value)}
          />
        </span>

        <span>
          <input
            value={question.points}
            onChange={(e) => changePoints(question.id, e)}
            className="outline-none text-md w-[3.6ch] bg-slate-200 rounded-md px-1 mx-1 text-right"
            type="number"
            min={1}
            max={100}
            maxLength={2}
          />
          points
        </span>
      </div>
      <div className={"flex flex-col gap-1 py-1"}>
        {isInputQuestionParams(question) ? (
          <Input
            key={`${question.id}${index}`}
            answer={question?.answer}
            id={question.id}
          />
        ) : (
          question.variants?.map((variant: VariantParams, index: number) => (
            <Variant
              type={question.type}
              key={`${question.id}${index}`}
              index={index}
              noDelete={question.variants.length < 2 ? true : false}
              variant={variant}
              id={question.id}
            />
          ))
        )}
      </div>
      <div className={"flex gap-1 justify-start"}>
        {question.type !== "input" && (
          <button onClick={() => addVariant(question.id)}>
            <FaPlus size={"1.3rem"} />
          </button>
        )}
        <button
          onClick={() => deleteQuestion(question.id)}
          onMouseOver={() => setShowOutline(true)}
          onMouseOut={() => setShowOutline(false)}
        >
          <MdDelete
            style={{ transition: "0.4s" }}
            size={"1.3rem"}
            color={showOutline ? "ff3422" : "#252525"}
          />
        </button>
      </div>
    </div>
  );
};

export default VariantQuestion;
