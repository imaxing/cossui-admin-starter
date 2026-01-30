import type * as React from "react";

import { cn } from "../lib";

function Table({
  className,
  ...props
}: React.ComponentProps<"table"> & { "data-slot"?: string }) {
  const { ["data-slot"]: dataSlot, ...rest } = props;

  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto",
      )}
      data-slot="table-container"
    >
      <table
        className={cn(
          "w-full caption-bottom text-sm border-collapse",
          className,
        )}
        data-slot={dataSlot ?? "table"}
        {...(rest as React.ComponentProps<"table">)}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "bg-muted/30 [&_tr]:border-b [&_tr]:border-border [&_tr]:hover:bg-transparent",
        className,
      )}
      data-slot="table-header"
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "bg-background",
        className,
      )}
      data-slot="table-body"
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn(
        "bg-muted/30 font-medium",
        className,
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors hover:bg-muted/20 data-[state=selected]:bg-muted/50",
        className,
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-11 whitespace-nowrap px-4 text-left align-middle font-medium text-muted-foreground text-sm has-[[role=checkbox]]:w-px has-[[role=checkbox]]:pe-0",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "h-12 whitespace-nowrap px-4 align-middle text-sm text-foreground has-[[role=checkbox]]:pe-0",
        className,
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn(
        "in-data-[slot=frame]:my-4 mt-4 text-muted-foreground text-sm",
        className,
      )}
      data-slot="table-caption"
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
