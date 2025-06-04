import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import React from "react";
import { ApiError } from "../lib/api/types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Label } from "@/components/ui/label";

export default function ApiErrorMessage({
  error,
}: {
  error: FetchBaseQueryError | SerializedError;
}) {
  if ("data" in error) {
    const castedError = error.data as unknown as ApiError;
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <div className="flex flex-col gap-1">
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {castedError.messages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return <Label>Error desconocido...</Label>;
}
