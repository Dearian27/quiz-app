"use client";
import React, { useState } from "react";
import { useQuestionContext, VariantParams } from "./QuestionProvider";
import { MdDelete } from "react-icons/md";
import classNames from "classnames";
import { QuestionTypeVariants } from "@/app/(pages)/editor/[id]/page";

const Variant = ({
  variant,
  type,
  id,
  noDelete,
  index,
}: {
  type: QuestionTypeVariants;
  variant: VariantParams;
  id: number;
  noDelete: boolean;
  index: number;
}) => {
  const { deleteVariant, updateVariant, setRightVariant } =
    useQuestionContext();
  const [showOutline, setShowOutline] = useState(false);

  return (
    <div
      className={classNames(
        showOutline ? "!border-[red]" : "",
        "flex items-center justify-between border-[white] border-2"
      )}
    >
      <div className="flex items-center gap-1">
        <input
          className={"h-4 w-4"}
          name={`g${id}`}
          type={type === "checkbox" ? "checkbox" : "radio"}
          checked={variant.isRight}
          onChange={(e) => setRightVariant(e.target.checked, id, index, type)}
        />
        <input
          className={"outline-none"}
          value={variant.text}
          onChange={(e) => updateVariant(id, index, e.target.value)}
          placeholder="Відповідь"
          type="text"
        />
      </div>
      {type !== "input" && (
        <button
          onMouseOut={() => {
            if (!noDelete) setShowOutline(false);
          }}
          onMouseOver={() => {
            if (!noDelete) setShowOutline(true);
          }}
          disabled={noDelete}
          onClick={() => deleteVariant(id, index)}
        >
          <MdDelete
            style={{
              transition: "0.4s",
              cursor: `${noDelete ? "not-allowed" : "pointer"}`,
            }}
            size={"1.3rem"}
            color={noDelete ? "grey" : showOutline ? "ff3422" : "#252525"}
          />
        </button>
      )}
    </div>
  );
};

export default Variant;
