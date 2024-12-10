/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { Root, RootContent } from "hast";
import { API_BASE } from "@/lib/const.ts";

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
      // @ts-ignore
      jsx,
      // @ts-ignore
      jsxs,
      Fragment,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeRewrite,
          {
            rewrite: (node: Root | RootContent) => {
              // @ts-ignore
              if (node?.properties?.src) {
                // @ts-ignore
                node.properties.src = `${API_BASE}/static-training/${path}/${node.properties.src}`;
              } else if (
                node?.type === "mdxJsxFlowElement" &&
                (node?.name === "video" || node?.name === "img")
              ) {
                node.attributes[0].value = `${API_BASE}/static-training/${path}/${node.attributes[0].value}`;
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
