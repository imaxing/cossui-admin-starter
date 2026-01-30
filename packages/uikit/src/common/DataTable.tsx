"use client";

import { ReactNode } from "react";
import { Table, TableColumn } from "../common";

export interface Column {
  label: string;
  prop: string;
  width?: number;
  minWidth?: number;
  render?: (row: any) => ReactNode;
  fixed?: "left" | "right";
}

export interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  actions?: (row: any) => ReactNode;
  header?: ReactNode;
}

export default function DataTable(props: DataTableProps) {
  const { columns, data, loading, pagination, actions, header } = props;

  // 转换列定义
  const tableColumns: TableColumn[] = columns.map((col) => ({
    title: col.label,
    dataIndex: col.prop,
    key: col.prop,
    width: col.width,
    render: col.render,
  }));

  // 添加操作列
  if (actions) {
    tableColumns.push({
      title: "操作",
      key: "actions",
      width: 400,
      render: (_value: any, record: any) => actions(record),
    });
  }

  return (
    <div>
      {header && <div>{header}</div>}
      <Table
        columns={tableColumns}
        dataSource={data}
        loading={loading}
        rowKey={(record) =>
          String((record.uuid as string) || (record.id as string))
        }
        pagination={
          pagination
            ? {
                current: pagination.page,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: pagination.onChange,
              }
            : false
        }
      />
    </div>
  );
}
