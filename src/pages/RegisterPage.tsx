
import { Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-social-background to-white">
      <div className="mb-8 text-center">
        <Link to="/" className="inline-block">
          <h1 className="text-4xl font-bold text-social-primary">ConnectSphere</h1>
          <p className="text-social-muted mt-1">Connect. Share. Grow.</p>
        </Link>
      </div>
      
      <div className="w-full max-w-md">
        <AuthForm mode="register" onModeChange={() => {}} />
      </div>
    </div>
  );
};

export default RegisterPage;
