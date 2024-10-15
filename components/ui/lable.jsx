"use client";

import React, { forwardRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

// Define label variants using class-variance-authority
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// Create the Label component
const Label = forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));

// Set display name for debugging purposes
Label.displayName = "Label";

export { Label };
