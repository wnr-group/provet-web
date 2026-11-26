import Image from "next/image";

// The frame shared by the signed-out admin pages: sign in, forgot password and
// choose a new password.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-700 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-white">
          <span className="rounded-2xl bg-white px-4 py-2.5">
            <Image src="/logo-full.png" alt="Provet" width={894} height={331} className="h-16 w-auto" />
          </span>
          <h1 className="mt-3 font-display text-xl font-extrabold">{title}</h1>
          <p className="text-center text-sm text-brand-200">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
