import AuthShell from "@/components/admin/AuthShell";
import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export const metadata = { title: "Reset password - Provet Admin", robots: { index: false, follow: false } };

export default async function ForgotPassword({ searchParams }) {
  const params = await searchParams;
  return (
    <AuthShell title="Reset your password" subtitle="We will email you a link to choose a new one">
      <ForgotPasswordForm expired={Boolean(params?.expired)} />
    </AuthShell>
  );
}
