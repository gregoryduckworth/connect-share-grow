
export const LandingFooter = () => {
  return (
    <footer className="bg-gray-50 py-8" data-testid="landing-footer">
      <div className="container mx-auto px-4 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-social-primary rounded-full" />
            <span className="text-sm text-gray-600">
              © 2024 ConnectSphere. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
