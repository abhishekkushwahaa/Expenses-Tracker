import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";

import { api } from "@/lib/api";

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({ json: value });
      if (!res.ok) {
        throw new Error("Failed to create expense");
      }
      navigate({ to: "/expenses" });
    },
  });

  return (
    <div className="p-2">
      <h2 className="max-w-3xl m-auto mb-4">Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="max-w-3xl m-auto"
      >
        <form.Field
          name="title"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <em className="text-red-500">
                  {field.state.meta.touchedErrors}
                </em>
              ) : null}
            </>
          )}
        />
        <form.Field
          name="amount"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type="number"
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
              {field.state.meta.touchedErrors ? (
                <em className="text-red-500">
                  {field.state.meta.touchedErrors}
                </em>
              ) : null}
            </>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canCreate, isCreating]) => (
            <Button type="submit" disabled={!canCreate} className="mt-4">
              {isCreating ? "Creating..." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
