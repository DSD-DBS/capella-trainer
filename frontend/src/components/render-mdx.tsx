import { useState, useEffect } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";

import type { FC, ReactNode } from "react";
import { MDXProps } from "mdx/types";
import remarkGfm from "remark-gfm";
import rehypeRewrite from "rehype-rewrite";

import Admonition from "@/components/markdown/admonition.tsx";
import InlineImageFactory from "@/components/markdown/inline-image.tsx";
import CaIcon from "@/components/markdown/caicon.tsx";

type ReactMDXContent = (props: MDXProps) => ReactNode;

export const RenderMdx: FC<{ source?: string; path: string }> = ({
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
            rewrite: (node) => {
              console.log(node);
              if (node?.properties?.src) {
                node.properties.src = `${import.meta.env.VITE_API_BASE}/static-training/${path}/${node.properties.src}`;
              } else if (
                node?.type === "mdxJsxFlowElement" &&
                (node?.name === "video" || node?.name === "img")
              ) {
                node.attributes[0].value = `${import.meta.env.VITE_API_BASE}/static-training/${path}/${node.attributes[0].value}`;
              }
            },
          },
        ],
      ],
    }).then((r) => setMdxContent(() => r.default));
  }, [source]);

  return (
    <MdxContent
      components={{
        Admonition,
        InlineImage: InlineImageFactory({ path }),
        CaIcon,
      }}
    />
  );
};