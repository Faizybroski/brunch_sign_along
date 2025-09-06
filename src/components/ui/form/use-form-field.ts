
import * as React from "react"
import { useFormContext } from "react-hook-form"
import { FormFieldContext } from "./form-field-context"
import { FormItemContext } from "./form-item-context"
import { UseFormFieldReturn } from "./types"

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const formContext = useFormContext()

  if (!formContext || !fieldContext) {
    throw new Error("useFormField should be used within <FormField> and a Form context")
  }

  const { getFieldState, formState } = formContext

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}
