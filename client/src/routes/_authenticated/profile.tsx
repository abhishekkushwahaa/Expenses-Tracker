import { createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);
  if (error) return <div>Error: {error.message}</div>;
  if (isPending) return <div>Loading...</div>;
  return (
    <div className="p-2 max-w-3xl m-auto">
      <div className="flex items-center gap-2">
        <Avatar>
          {data.user.picture && (
            <AvatarImage src={data.user.picture} alt={data.user.given_name} />
          )}
          <AvatarFallback>{data.user.given_name}</AvatarFallback>
        </Avatar>
        <p>Hello, {data.user.given_name}</p>
      </div>
      <Button asChild className="my-4">
        <a href="/api/logout">Logout</a>
      </Button>
    </div>
  );
}
