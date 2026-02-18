interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  isEager?: boolean;
}

export const Image = ({ alt, width, height, src, isEager = false }: Props) => {
  return (
    <img
      alt={alt}
      height={height}
      loading={isEager ? 'eager' : 'lazy'}
      src={src}
      width={width}
    />
  );
};
