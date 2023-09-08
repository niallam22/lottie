import RegisterForm from "@/app/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

export default async function Register() {
  const session = await getServerSession(options);

  if (session) redirect("/dashboard");

  return <RegisterForm />;
}
