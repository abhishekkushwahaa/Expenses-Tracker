import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";

import { api } from "@/lib/api";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createExpenseSchema } from "../../../../server/validation";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      title: "",
      amount: "",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await api.expenses.$post({ json: value });
        toast("Expense has been created", {
          description: `Your expense has been created successfully!`,
        });
        if (!res.ok) {
          console.error("Response:", res);
          throw new Error("Failed to create expense");
        }
        navigate({ to: "/expenses" });
      } catch (error) {
        toast("Something went wrong!", {
          description: "Failed to create expense. Please try again.",
        });
      }
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
        className="flex flex-col gap-y-4 max-w-3xl m-auto"
      >
        <form.Field
          name="title"
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={(field) => (
            <div>
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
            </div>
          )}
        />
        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type="number"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <em className="text-red-500">
                  {field.state.meta.touchedErrors}
                </em>
              ) : null}
            </div>
          )}
        />
        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={(field) => (
            <div className="self-center">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border shadow"
              />
              {field.state.meta.touchedErrors ? (
                <em className="text-red-500">
                  {field.state.meta.touchedErrors}
                </em>
              ) : null}
            </div>
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
