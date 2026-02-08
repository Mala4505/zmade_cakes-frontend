import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}
export function Card({
  className = '',
  noPadding = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zm-greyOlive/10 bg-white text-zm-stoneBrown shadow-card ${className}`}
      {...props}>

      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>);

}
export function CardHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 pb-0 ${className}`}
      {...props}>

      {children}
    </div>);

}
export function CardTitle({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-heading text-2xl leading-none tracking-tight text-zm-stoneBrown ${className}`}
      {...props}>

      {children}
    </h3>);

}
export function CardContent({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-4 ${className}`} {...props}>
      {children}
    </div>);

}