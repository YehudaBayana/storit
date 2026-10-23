import React from "react";

export interface PlayerBarProps {
  /** Whether the player bar is visible and active */
  visible?: boolean;
  /** Content to display inside the player bar */
  children: React.ReactNode;
  /** Test data hook selector */
  dataHook?: string;
}

const PlayerBar: React.FC<PlayerBarProps> = ({ visible = true, children, dataHook }) => {
  const visibilityClasses = visible
    ? "bottom-6 opacity-100 pointer-events-auto"
    : "-bottom-[150px] opacity-0 pointer-events-none";

  const baseClasses =
    "fixed left-4 right-4 md:left-[284px] md:right-6 h-[84px] z-[999] px-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-player)] backdrop-blur-xl shadow-[var(--shadow-player)] transition-all duration-500 cubic-bezier(0.16,1,0.3,1) flex items-center";

  return (
    <div data-hook={dataHook} className={`${baseClasses} ${visibilityClasses}`}>
      {children}
    </div>
  );
};

export default PlayerBar;
