"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

// Tiny helper shared by the plain-JSON forms: POST, surface the server's message, track state.
export function useFormSubmit(url: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(body: unknown): Promise<boolean> {
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        setStatus("done");
        return true;
      }
      const msg = typeof json.error === "string" ? json.error : json.error?.message;
      setError(msg || "Something went wrong. Please try again.");
    } catch {
      setError("Network problem — please check your connection and try again.");
    }
    setStatus("error");
    return false;
  }

  return { status, error, submit, reset: () => { setStatus("idle"); setError(""); } };
}
