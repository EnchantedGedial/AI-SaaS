"use client";
import React, { useState, useTransition ,useEffect} from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { aspectRatioOptions, defaultValues, transformationTypes,creditFee } from '../../constants/index.js'
import CustomField from '../shared/CustomField.jsx'
import {debounce} from "../../lib/utils.js"
import { getCldImageUrl } from "next-cloudinary"
import { deepMergeObjects } from '../../lib/utils.js';
import {updateCredits} from "../../lib/actions/user.action.js"
import { addImage, updateImage } from "../../lib/actions/image.actions.js"
import { useToast } from "../../hooks/use-toast";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

import { Input } from "../ui/input";
import MediaUploader from './MediaUploader.jsx';
import TransformedImage from './TransformedImage.jsx';
import { useRouter } from "next/navigation"
import { InsufficientCreditsModal } from './InsufficientCreditsModal.jsx';

// Define the form schema using Zod
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const TransformationForm = ({ action, data = null, userId, type, creditBalance, config = null }) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const initialValues = data && action === 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  } : defaultValues
  // Initialize the form with React Hook Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // State to manage submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form submission
  async function onSubmit(values) {
    setIsSubmitting(true)
  
    if (data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      })
  
      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color
      }
  
      if (action === "Add") {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: "/"

          })
  
          if (newImage) {
            form.reset()
            setImage(data)
            console.log(data);
            // toast({
            //   title: "Image Saved successfully",
            //   // description: "1 credit was deducted from your account",
            //   duration: 5000,
            //   className: "success-toast",
            // });
            router.push(`/transformations/${newImage._id}`)
          }
        } catch (error) {
          console.log(error)
        }
      }
  
      if (action === "Update") {
        try {
          const updatedImage = await updatedImage({
            image: {
              ...imageData,
              _id: data._id
            },
            userId,
            path: `/transformations/${data._id}`
          })
  
          if (updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  
    setIsSubmitting(false)
  }
  

  const onSelectFieldHandler = (value, onChangeField) => {
    const imageSize = aspectRatioOptions[value];

    setImage((prevState) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));

    setNewTransformation(transformationType.config);

    return onChangeField(value);
  };

  const onInputChangeHandler = (fieldName, value, type, onChangeField) => {
    debounce(() => {
      setNewTransformation((prevState) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to']: value,
        },
      }));
    }, 1000)();

    return onChangeField(value);
  };

  const onTransformHandler = async () => {
    setIsTransforming(true)
  
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    )
  
    setNewTransformation(null)
  
    startTransition(async () => {
      await updateCredits(userId, creditFee)
    })
  }
  
  useEffect(() => {
    if (image && (type === "restore" || type === "removeBackground")) {
      setNewTransformation(transformationType.config)
    }
  }, [image, transformationType.config, type])
  



  return <>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
{creditBalance<Math.abs(creditFee) && <InsufficientCreditsModal/>}
        <CustomField

          control={form.control}
          name='title'
          FormLabel='Image Title'
          className='w-full'
          render={({ field }) => <Input{...field}
            className='input-field'
          />}
        />

        {type === 'fill' && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === 'remove' || type === 'recolor') && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={type === 'remove' ? 'Object to remove' : 'Object to recolor'}
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                  )}
                />
              )}
            />

            {type === 'recolor' && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}
                  />
                )}
              />
            )}



          </div>


        )}

        <div className="media-uploader-field">
          {CustomField({
            control: form.control,
            name: "publicId",
            className: "flex size-full flex-col",
            render: ({ field }) =>
              MediaUploader({
                onValueChange: field.onChange,
                setImage: setImage,
                publicId: field.value,
                image: image,
                type: type,
              }),
          })}
          

          {TransformedImage({
            image: image,
            type: type,
            title: form.getValues().title,
            isTransforming: isTransforming,
            setIsTransforming: setIsTransforming,
            transformationConfig: transformationConfig,
          })}
        </div>


        <div className="flex flex-col gap-4">
          <Button
            type="button"
            className="submit-button capitalize"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>
          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>



      </form>
    </Form>

  </>
};



export default TransformationForm;
