import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";
import { type ApiRoutes } from "../../../server/app";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
  const response = await api.me.$get();
  if (!response.ok) throw new Error("Failed to fetch total spent");
  const data = await response.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export async function deleteExpense({ id }: { id: number }) {
  const response = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  });
  if (!response.ok) throw new Error("Failed to delete expense");
  return response;
}
