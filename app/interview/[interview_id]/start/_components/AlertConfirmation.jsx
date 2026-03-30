"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AlertConfirmation({ children, stopInterview }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#0B1220] border border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            End Interview?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-gray-400">
            If you end the interview now, your responses will be submitted and
            the session will close.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border border-white/10 text-white">
            Continue Interview
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={stopInterview}
            className="bg-red-600 hover:bg-red-700"
          >
            End Interview
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertConfirmation;
