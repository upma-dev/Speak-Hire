"use client";

import Provider from "./provider";

export default function ClientProviders({ children }) {
  return <Provider>{children}</Provider>;
}
