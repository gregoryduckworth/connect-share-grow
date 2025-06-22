
import { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-social-background">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default RegisterPage;
