import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

async function getTotal() {
  const response = await api.expenses["total"].$get();
  if (!response.ok) throw new Error("Failed to fetch total spent");
  const data = await response.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total"],
    queryFn: getTotal,
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Card className="w-[350px] m-auto mt-5 font-serif">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>${isPending ? "..." : data.totalSpent}</CardContent>
      </Card>
    </>
  );
}
