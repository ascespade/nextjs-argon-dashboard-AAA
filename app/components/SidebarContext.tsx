"use client";
import React, { createContext, useContext, useState } from 'react';

type SidebarContextType = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(v => !v);
  return <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>{children}</SidebarContext.Provider>;
};

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
