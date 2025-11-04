"use client";
import { getLoggedInUser } from "@/utils/data/users";

export default async function CheckLoggedInUser() {
  const user = await getLoggedInUser();
  if(user && user.role === 'admin'){
    return true;
  }
  else{
    window.location.href = '/';
    return false;
  }
}
