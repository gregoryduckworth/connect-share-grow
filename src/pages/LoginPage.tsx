
import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";

const LoginPage = () => {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-social-background">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default LoginPage;
