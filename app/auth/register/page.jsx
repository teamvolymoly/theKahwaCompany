import { Suspense } from "react";
import AccountClient from "../AccountClient";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AccountClient />
    </Suspense>
  );
}
