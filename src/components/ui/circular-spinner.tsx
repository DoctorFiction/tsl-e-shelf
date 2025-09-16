export function CircularSpinner({ size = 6 }: { size?: number }) {
  const px = `${size}rem`;
  return <div style={{ width: px, height: px }} className="border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" aria-hidden="true" />;
}
