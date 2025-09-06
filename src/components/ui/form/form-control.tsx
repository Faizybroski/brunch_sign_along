
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { useFormField } from "./use-form-field"
import { UseFormFieldReturn } from "./types"

export const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const defaultFieldInfo: UseFormFieldReturn = { 
    id: '', 
    name: '',
    formItemId: '', 
    formDescriptionId: '', 
    formMessageId: '', 
    error: null 
  };
  
  let fieldInfo = defaultFieldInfo;
  try {
    fieldInfo = useFormField() as UseFormFieldReturn;
  } catch (e) {
    // Use defaults when outside form context
  }
  
  const { error, formItemId, formDescriptionId, formMessageId } = fieldInfo;

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"
