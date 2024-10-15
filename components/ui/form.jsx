"use client";
import React, { useContext, createContext, forwardRef, useId } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { cn } from "../../lib/utils";
// import { Label } from "@/components/ui/label";
import { Label } from "../ui/lable";

// Alias FormProvider as Form
const Form = FormProvider;

// Create contexts without TypeScript generics
const FormFieldContext = createContext({});
const FormItemContext = createContext({});

// FormField component
const FormField = ({ name, control, rules, defaultValue, render }) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={render}
      />
    </FormFieldContext.Provider>
  );
};

// Custom hook to use form field context
const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// FormItem component
const FormItem = forwardRef(({ className, ...props }, ref) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// FormLabel component
const FormLabel = forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

// FormControl component
const FormControlComponent = forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

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
  );
});
FormControlComponent.displayName = "FormControl";

// FormDescription component
const FormDescription = forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// FormMessage component
const FormMessage = forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
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
  );
});
FormMessage.displayName = "FormMessage";

// Export all components
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControlComponent as FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
