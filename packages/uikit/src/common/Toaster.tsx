"use client";

import React from "react";
import { Toaster as UIToaster } from "../ui/toaster";

export interface ToasterProps {
  className?: string;
}

/**
 * common 层 Toaster 封装
 * - 业务层不直接使用 ui/sonner
 * - UI 与 shadcn 文档一致
 */
export function Toaster(_props: ToasterProps) {
  return <UIToaster position="bottom-center" />;
}
