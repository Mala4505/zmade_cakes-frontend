import { useNavigate, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  const is404 =
    error?.status === 404 ||
    error?.statusText === 'Not Found' ||
    error?.message?.includes('No match');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center bg-background">
      <img
        src="/logo.jpeg"
        alt="ZMade Cakes"
        className="w-28 h-28 object-contain rounded-2xl shadow-sm"
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">
          {is404 ? '404' : 'Oops'}
        </h1>
        <p className="text-xl font-medium text-foreground">
          {is404 ? 'Page not found' : 'Something went wrong'}
        </p>
        <p className="text-muted-foreground max-w-sm mt-1">
          {is404
            ? "We couldn't find the page you're looking for."
            : 'An unexpected error occurred. Please try again.'}
        </p>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}