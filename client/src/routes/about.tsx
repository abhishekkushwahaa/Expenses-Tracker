import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2 max-w-3xl m-auto">
      <h1 className="text-2xl font-bold mt-2">About</h1>
      <p className="mt-2">
        This is a simple expense tracker application built with React, Vite, and
        Tanstack libraries like React Query, React Router, and Zod in the client
        and Hono in the server with bun environment.
        <br />
        It's a full-stack application with authentication and authorization
        using a kinde of OAuth2.0.
        <br />
        It's Awesome and you can use it as a template for your next project.
      </p>
    </div>
  );
}
