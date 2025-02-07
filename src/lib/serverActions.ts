"use server";

import { revalidatePath } from "next/cache";
import { getUsers, addCredits, deleteUser } from "@/src/lib/users";

export async function fetchUsers() {
  return await getUsers();
}

export async function addUserCredits(userId: string, credits: number = 5) {
  await addCredits(userId, credits);
  revalidatePath("/dashboard/users/list");
}

export async function removeUser(userId: string) {
  await deleteUser(userId);
  revalidatePath("/dashboard/users/list");
}
