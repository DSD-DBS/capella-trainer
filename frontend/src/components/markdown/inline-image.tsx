/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { API_BASE } from "@/lib/const.ts";

const InlineImage = ({
  src,
  alt,
  path,
}: {
  src: string;
  alt: string;
  path: string;
}) => {
  const properSource = `${API_BASE}/static-training/${path}/${src}`;
  return (
    <img src={properSource} alt={alt} className="not-prose inline-block w-4" />
  );
};

const InlineImageFactory = ({ path }: { path: string }) => {
  return ({ src, alt }: { src: string; alt: string }) => (
    <InlineImage src={src} alt={alt} path={path} />
  );
};

export default InlineImageFactory;
