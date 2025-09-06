
import { FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
}

export interface FormItemContextValue {
  id: string
}

export interface UseFormFieldReturn {
  id: string
  name: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  error: any | null
}
