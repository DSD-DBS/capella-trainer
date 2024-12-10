/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TriangleAlert, Info, CircleCheck } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";

const admonition = cva("border-l-2", {
  variants: {
    variant: {
      info: "bg-blue-100/50 border-blue-500 text-blue-700",
      warning: "bg-yellow-100/50 border-yellow-500 text-yellow-700",
      danger: "bg-red-100/50 border-red-500 text-red-700",
      success: "bg-green-100/50 border-green-500 text-green-700",
    },
  },
});

const Admonition = ({
  variant,
  children,
}: {
  variant: VariantProps<typeof admonition>["variant"];
  children: React.ReactNode;
}) => {
  return (
    <div className={admonition({ variant })}>
      <div className="px-4">
        <div className="flex items-center">
          {variant === "info" && <Info className="shrink-0" size={24} />}
          {variant === "warning" && (
            <TriangleAlert className="shrink-0" size={24} />
          )}
          {variant === "danger" && (
            <TriangleAlert className="shrink-0" size={24} />
          )}
          {variant === "success" && (
            <CircleCheck className="shrink-0" size={24} />
          )}
          <div className="ml-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Admonition;
