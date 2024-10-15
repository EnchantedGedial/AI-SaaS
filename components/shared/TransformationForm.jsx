"use client";
import React, { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

// Define the form schema using Zod
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." })
    .max(50, { message: "Username cannot exceed 50 characters." }),
});

const TransformationForm = () => {
  // Initialize the form with React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // State to manage submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form submission
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      // Replace this with your actual submission logic
      await fakeApiCall(values);
      setSubmitSuccess(true);
      console.log("Form submitted successfully:", values);
    } catch (error) {
      setSubmitError("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username">Username</FormLabel>
              <FormControl>
                <Input id="username" placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <p className="text-red-500">{submitError}</p>}
        {submitSuccess && <p className="text-green-500">Form submitted successfully!</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

// Mock API call function for demonstration purposes
const fakeApiCall = (values) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success or failure randomly
      Math.random() > 0.5 ? resolve() : reject();
    }, 2000);
  });
};

export default TransformationForm;
