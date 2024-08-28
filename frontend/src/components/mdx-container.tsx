import { useState, useEffect } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";

import type { FC, ReactNode } from "react";
import { MDXProps } from "mdx/types";
import remarkGfm from "remark-gfm";
import rehypeRewrite from "rehype-rewrite";

import Admonition from "@/components/admonition.tsx";

type ReactMDXContent = (props: MDXProps) => ReactNode;

export const Preview: FC<{ source?: string; path: string }> = ({
  source = "",
  path,
}) => {
  const [MdxContent, setMdxContent] = useState<ReactMDXContent>(
    () => () => null,
  );

  useEffect(() => {
    evaluate(source, {
      jsx,
      jsxs,
      Fragment,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeRewrite,
          {
            selector: "img",
            rewrite: (node) => {
              if (node.properties.src) {
                node.properties.src = `http://localhost:8000/static-training/${path}/${node.properties.src}`;
              }
            },
          },
        ],
      ],
      baseUrl: `http://localhost:8000/static-training/${path}/`,
    }).then((r) => setMdxContent(() => r.default));
  }, [source]);

  return <MdxContent components={{ Admonition }} />;
};
