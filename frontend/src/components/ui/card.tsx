// src/components/ui/card.tsx

import React from "react";
import clsx from "clsx";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
};

export function Card({ children, className, title, icon }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl shadow-md bg-white dark:bg-gray-900 p-4 transition hover:shadow-lg",
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3 text-xl font-semibold text-gray-800 dark:text-white">
          {icon && <div className="text-primary">{icon}</div>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardContent({ children, className }: CardContentProps) {
  return <div className={clsx("p-2", className)}>{children}</div>;
}
