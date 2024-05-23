"use client";
import { useRouter } from "next/navigation";

type QuizPageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: QuizPageProps) {
  return <p>Post: {params.id}</p>;
}
