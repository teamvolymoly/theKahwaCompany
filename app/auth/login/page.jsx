import { Suspense } from "react";
import AccountClient from "../AccountClient";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AccountClient />
    </Suspense>
  );
}
