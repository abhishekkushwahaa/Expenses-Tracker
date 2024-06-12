import { createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);
  if (error) return <div>Error: {error.message}</div>;
  if (isPending) return <div>Loading...</div>;
  return (
    <div className="p-2">
      <p>Hello, {data.user.email}</p>
      <Button className="mt-3">
        <a href="/api/logout">Logout</a>
      </Button>
    </div>
  );
}
