import React from "react";
import { Box, Flex, Text, Link } from "@/components/ui";
import { IconType } from "react-icons";

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: IconType;
  badge?: string;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  logo?: React.ReactNode;
  sections: SidebarSection[];
  activeId: string;
  footer?: React.ReactNode;
  testId?: string;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  logo,
  sections,
  activeId,
  footer,
  testId = "sidebar",
  className = "",
}) => {
  return (
    <Box
      testId={testId}
      as="aside"
      className={`w-64 bg-white border-r border-gray-100 flex flex-col h-screen p-6 justify-between ${className}`}
    >
      {/* Top Section: Logo & Navigation */}
      <Flex direction="col" gap="lg" className="overflow-y-auto">
        {logo && <Box className="px-2">{logo}</Box>}

        <Flex direction="col" gap="xl">
          {sections.map((section, idx) => (
            <Flex key={idx} direction="col" gap="sm">
              {section.title && (
                <Text
                  size="xs"
                  variant="muted"
                  className="px-3 font-semibold uppercase tracking-wider"
                >
                  {section.title}
                </Text>
              )}
              <Flex direction="col" gap="xs">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeId;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      testId={`${testId}-item-${item.id}`}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                        isActive
                          ? "bg-brand-50 text-brand-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Flex align="center" gap="sm">
                        <Icon
                          className={`w-5 h-5 ${isActive ? "text-brand-500" : "text-gray-400"}`}
                        />
                        <span>{item.label}</span>
                      </Flex>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Bottom Footer Widget (e.g. Storage/User Info) */}
      {footer && <Box className="pt-4 border-t border-gray-100">{footer}</Box>}
    </Box>
  );
};

export default Sidebar;
