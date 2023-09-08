import LoginForm from '@/app/components/LoginForm';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

export default async function Login() {
  const session = await getServerSession(options);

  if (session) redirect("/dashboard");

  return <LoginForm />
}