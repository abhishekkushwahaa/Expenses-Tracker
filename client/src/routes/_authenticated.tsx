import { Button } from "@/components/ui/button";
import { userQueryOptions } from "@/lib/api";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const Login = () => {
  return (
    <div>
      You have to login!
      <Button className="m-3">
        <a href="/api/login">Login</a>
      </Button>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }

  return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (error) {
      return { user: null };
    }
  },
  component: Component,
});
