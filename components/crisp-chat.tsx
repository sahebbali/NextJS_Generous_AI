"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("7333d010-7281-4c17-a007-983d632476da");
  }, []);

  return null;
};
