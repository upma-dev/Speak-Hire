"use client";

import { createContext, useState } from "react";

export const InterviewDataContext = createContext();

export function InterviewDataProvider({ children }) {
  const [interviewInfo, setInterviewInfo] = useState();

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      {children}
    </InterviewDataContext.Provider>
  );
}
