"use server";

import { revalidatePath } from "next/cache";
import { getUsers, addCredits, deleteUser } from "@/src/lib/users";
import { getStations, deleteStation } from "@/src/lib/stations";

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

export async function fetchStations() {
  return await getStations();
}

export async function removeStation(toStationId: string) {
  return await deleteStation(toStationId);
}