
import * as React from "react"
import { cn } from "@/lib/utils"
import { useFormField } from "./use-form-field"

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  let error = null;
  let formMessageId = '';
  try {
    const field = useFormField();
    error = field.error;
    formMessageId = field.formMessageId;
  } catch (e) {
    // Use defaults when outside form context
  }

  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"
