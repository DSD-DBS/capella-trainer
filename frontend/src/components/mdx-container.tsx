import { useState, useEffect } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";

import type { FC, ReactNode } from "react";
import type { EvaluateOptions } from "@mdx-js/mdx";
import { Button } from "@/components/ui/button.tsx";
import { MDXProps } from "mdx/types";

type ReactMDXContent = (props: MDXProps) => ReactNode;
type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;

const runtime = { jsx, jsxs, Fragment } as Runtime;

export const Preview: FC<{ source?: string }> = ({ source = "" }) => {
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null,
  );

  useEffect(() => {
    evaluate(source, runtime).then((r) => setMdxContent(() => r.default));
  }, [source]);

  return <MdxContent components={{ Button }} />;
};
