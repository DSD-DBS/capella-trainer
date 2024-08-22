import { useState, useEffect } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";

import type { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { MDXProps } from "mdx/types";
import remarkGfm from "remark-gfm";

type ReactMDXContent = (props: MDXProps) => ReactNode;

export const Preview: FC<{ source?: string }> = ({ source = "" }) => {
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null,
  );

  useEffect(() => {
    evaluate(source, { jsx, jsxs, Fragment, remarkPlugins: [remarkGfm] }).then(
      (r) => setMdxContent(() => r.default),
    );
  }, [source]);

  return <MdxContent components={{ Button }} />;
};
