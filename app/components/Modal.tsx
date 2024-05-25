"use client";
import classNames from "classnames";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { ComponentPropsWithoutRef, FC, useRef } from "react";
import { useClickOutside } from "./utils/useClickOutside";

interface ModalProps extends ComponentPropsWithoutRef<"div"> {}

const Modal: FC<ModalProps> = ({ children, className }) => {
  const router = useRouter();
  const modalRef = useRef(null!);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  useClickOutside(modalRef, () => router.push(pathname));

  if (!modal) return null;

  return (
    <div className="absolute top-0 left-0 flex justify-center items-center h-[100vh] w-[100%] bg-[#0000003a]">
      <div
        ref={modalRef}
        className={classNames(
          "min-w-[340px] rounded-md bg-white p-4",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
