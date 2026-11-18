import Image from "next/image";

// The frame shared by the signed-out admin pages: sign in, forgot password and
// choose a new password.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-700 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2">
            <Image src="/logo-mark.png" alt="" width={56} height={56} className="h-full w-full object-contain" />
          </span>
          <h1 className="mt-3 font-display text-xl font-extrabold">{title}</h1>
          <p className="text-center text-sm text-brand-200">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
