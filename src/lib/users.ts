// @/src/lib/users.ts
import api from "@/src/services/api";
import { RegisterUserData } from "@/src/types";
import { AxiosError } from "axios";

export async function getUsers() {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
}

export const deleteUser = async (userID: string) => {
  try {
    await api.delete(`/users/${userID}`);
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
};

export const registerUser = async (userData: RegisterUserData): Promise<void> => {
  try {
    await api.post('/users/register', userData);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Erro ao registrar usuário:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao registrar usuário.");
    } else {
      console.error("Erro desconhecido:", error);
      throw new Error("Erro desconhecido ao registrar usuário.");
    }
  }
};

export const updateUser = async (userId: string, userData: Partial<RegisterUserData>): Promise<void> => {
  try {
    await api.patch(`/users/update-user/${userId}`, userData);
    console.log("Usuário atualizado com sucesso!");
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Erro ao atualizar usuário:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erro ao atualizar usuário.");
    } else {
      console.error("Erro desconhecido:", error);
      throw new Error("Erro desconhecido ao atualizar usuário.");
    }
  }
};

export const addCredits = async (userId: string, credits: number = 5): Promise<void> => {
  try {
    await api.patch(`/users/add-credits/${userId}`, { creditsToAdd: credits });
    console.log("Créditos adicionados com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar créditos:", error);
    throw error;
  }
};

