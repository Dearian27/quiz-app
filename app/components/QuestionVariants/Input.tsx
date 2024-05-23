import React from "react";
import { useQuestionContext } from "./QuestionProvider";

const Input = ({ answer, id }: { answer: string; id: number }) => {
  const { updateInputText } = useQuestionContext();

  return (
    <div>
      <input
        className="outline-none text-md"
        type="text"
        placeholder="Відповідь"
        value={answer}
        onChange={(e) => updateInputText(id, e.target.value)}
      />
    </div>
  );
};

export default Input;
