
import * as React from "react"
import { cn } from "@/lib/utils"
import { useFormField } from "./use-form-field"

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  let formDescriptionId = '';
  try {
    const field = useFormField();
    formDescriptionId = field.formDescriptionId;
  } catch (e) {
    // Use default when outside form context
  }

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"
