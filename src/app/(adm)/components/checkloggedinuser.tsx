"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLoggedInUser } from "@/utils/data/users";

export default function CheckLoggedInUser({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getLoggedInUser();
      if (!user || user.role !== 'admin') {
        router.push('/');
      }
    };
    
    checkUser();
  }, [router]);

  return <>{children}</>;
}
