import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { aspectRatioOptions } from "../constants/index";
export function cn(...inputs) {
  return twMerge(clsx(inputs))

  
}
// PLACEHOLDER LOADER - while image is transforming
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = str =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str)

export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`


export const getImageSize = (type, image, dimension) => {
  if (type === "fill") {
    return aspectRatioOptions[image.aspectRatio]?.[dimension] || 1000
  }
  return image?.[dimension] || 1000
}

// DOWNLOAD IMAGE
export const download = (url, filename) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one")
  }

  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobURL = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobURL

      if (filename && filename.length)
        a.download = `${filename.replace(" ", "_")}.png`
      document.body.appendChild(a)
      a.click()
    })
    .catch(error => console.log({ error }))
}

