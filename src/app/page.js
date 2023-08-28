import Image from 'next/image'

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "./api/auth/[...nextauth]/options"
import LoginForm from '@/components/LoginForm';


export default async function Home() {
  const session = await getServerSession(options);

  if (session) redirect("/dashboard");
  return (
    <div>
      <LoginForm/>
    </div>
  )
}
