import Image, { ImageProps } from "next/image";

const isUnoptimizableRemoteImage = (src: ImageProps["src"]) =>
  typeof src === "string" && src.startsWith("https://placehold.co/");

export function OptimizedImage({ alt, ...props }: ImageProps) {
  return (
    <Image
      {...props}
      alt={alt}
      unoptimized={props.unoptimized ?? isUnoptimizableRemoteImage(props.src)}
    />
  );
}
