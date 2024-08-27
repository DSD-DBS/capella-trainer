import { useState, useEffect } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";

import type { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { MDXProps } from "mdx/types";
import remarkGfm from "remark-gfm";
import rehypeMdxImportMedia from "rehype-mdx-import-media";

type ReactMDXContent = (props: MDXProps) => ReactNode;

export const Preview: FC<{ source?: string }> = ({ source = "" }) => {
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null,
  );

  useEffect(() => {
    evaluate(source, {
      jsx,
      jsxs,
      Fragment,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeMdxImportMedia],
      baseUrl: "http://localhost:8000/static-training/02-first-tests/",
    }).then((r) => setMdxContent(() => r.default));
  }, [source]);

  return <MdxContent components={{ Button }} />;
};
