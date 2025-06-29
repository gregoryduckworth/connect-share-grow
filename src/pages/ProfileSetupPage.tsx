import { Link } from "react-router-dom";
import ProfileSetup from "@/components/auth/ProfileSetup";

const ProfileSetupPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-social-background to-white"
      data-testid="profile-setup-page-root"
    >
      <div className="mb-8 text-center" data-testid="profile-setup-header">
        <Link
          to="/"
          className="inline-block"
          data-testid="profile-setup-logo-link"
        >
          <h1
            className="text-3xl md:text-4xl font-bold text-social-primary"
            data-testid="profile-setup-logo-title"
          >
            ConnectSphere
          </h1>
          <p
            className="text-social-muted mt-1"
            data-testid="profile-setup-logo-subtitle"
          >
            Connect. Share. Grow.
          </p>
        </Link>
      </div>

      <div
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm"
        data-testid="profile-setup-form-wrapper"
      >
        <ProfileSetup />
      </div>
    </div>
  );
};

export default ProfileSetupPage;
