"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";
import { Button } from "../ui/button";
import { Group, GroupSeparator } from "../ui/group";
import { MoreVertical } from "lucide-react";

export interface TableAction {
  text: string;
  onClick: () => void;
  /** 是否需要二次确认(第一次点击显示"确认操作?",第二次点击才执行) */
  confirm?: boolean;
}

export interface TableActionsProps {
  actions: TableAction[];
  /** 按钮模式阈值,actions 数量小于等于此值时显示为按钮,否则显示为菜单。默认为 2 */
  buttonModeThreshold?: number;
}

export function TableActions({ actions, buttonModeThreshold = 2 }: TableActionsProps) {
  const [open, setOpen] = useState(false);
  const [activeConfirmIndex, setActiveConfirmIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const confirmTimer = useRef<NodeJS.Timeout | null>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (confirmTimer.current) {
        clearTimeout(confirmTimer.current);
      }
    };
  }, []);

  const handleClick = async (action: TableAction, index: number) => {
    // 如果有确认文本,实现二次确认
    if (action.confirm) {
      if (activeConfirmIndex === index) {
        // 第二次点击:先恢复默认文本,再开启loading
        if (confirmTimer.current) {
          clearTimeout(confirmTimer.current);
          confirmTimer.current = null;
        }
        setActiveConfirmIndex(null);
        setOpen(false);

        // 先恢复默认文本,然后开启loading
        setTimeout(() => {
          setLoadingIndex(index);
        }, 0);

        try {
          await action.onClick();
        } finally {
          setLoadingIndex(null);
        }
      } else {
        // 第一次点击:显示确认文本
        if (confirmTimer.current) {
          clearTimeout(confirmTimer.current);
        }
        setActiveConfirmIndex(index);

        // 3 秒后自动恢复
        confirmTimer.current = setTimeout(() => {
          setActiveConfirmIndex(null);
          confirmTimer.current = null;
        }, 3000);
      }
    } else {
      // 没有确认文本,直接执行
      setOpen(false);
      setLoadingIndex(index);
      try {
        await action.onClick();
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  // 少量 actions 时显示为按钮组
  if (actions.length <= buttonModeThreshold) {
      const renderButtons = () => {
      const result: React.ReactNode[] = [];

      actions.forEach((action, index) => {
        const isConfirming = activeConfirmIndex === index;
        const isLoading = loadingIndex === index;
        const displayText = isConfirming ? '确认操作?' : action.text;

        // 确认状态时使用 default 高亮显示(深色背景)
        const buttonVariant = isConfirming ? 'default' : 'outline';

        // 每个按钮之间添加分隔符
        if (index > 0) {
          result.push(<GroupSeparator key={`sep-${index}`} />);
        }

        // 添加按钮
        result.push(
          <Button
            key={`btn-${index}`}
            variant={buttonVariant}
            size="sm"
            onClick={() => handleClick(action, index)}
            data-confirming={isConfirming || undefined}
            disabled={isLoading}
          >
            {isLoading ? `${action.text}中` : displayText}
          </Button>
        );
      });

      return result;
    };

    return (
      <Group aria-label="操作">
        {renderButtons()}
      </Group>
    );
  }

  // 多个 actions 时显示为下拉菜单
  return (
    <Menu open={open} onOpenChange={setOpen}>
      <MenuTrigger
        render={<Button aria-label="操作菜单" size="icon" variant="outline" />}
      >
        <MoreVertical className="size-4" />
      </MenuTrigger>
      <MenuPopup align="end">
        {actions.map((action, index) => {
          const isConfirming = activeConfirmIndex === index;
          const isLoading = loadingIndex === index;
          const displayText = isConfirming ? '确认操作?' : action.text;

          return (
            <MenuItem
              key={index}
              onClick={() => handleClick(action, index)}
              variant="default"
              data-confirming={isConfirming || undefined}
            >
              {isLoading ? `${action.text}中` : displayText}
            </MenuItem>
          );
        })}
      </MenuPopup>
    </Menu>
  );
}
