"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: "tags" | "count";
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
  variant = "tags",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-12 px-4 py-2 rounded-full border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors shadow-none text-zinc-900",
              className,
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-2 items-center text-left">
              {variant === "count" && selected.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0066FF] text-[10px] font-bold text-white">
                    {selected.length}
                  </div>
                  <span className="text-sm font-bold text-zinc-900">
                    {placeholder}
                  </span>
                </div>
              ) : selected.length > 0 ? (
                selected.map((value) => {
                  const option = options.find((o) => o.value === value);
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="rounded-full bg-zinc-200 text-zinc-900 hover:bg-zinc-300 border-none px-2 py-0.5 gap-1 shadow-none"
                    >
                      {option?.label}
                      <div
                        role="button"
                        tabIndex={0}
                        className="ml-1 flex items-center justify-center ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(value);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(value);
                        }}
                      >
                        <X className="h-3 w-3 text-zinc-500 hover:text-zinc-900" />
                      </div>
                    </Badge>
                  );
                })
              ) : (
                <span className="text-zinc-400 font-medium">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        }
      />
      <PopoverContent
        className="w-full p-0 border-zinc-200 rounded-3xl shadow-none mt-2 overflow-hidden bg-white"
        align="start"
      >
        <Command className="rounded-3xl border-none">
          <CommandInput
            placeholder="Search categories..."
            className="h-12 border-none focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CommandList>
            {filteredOptions.length === 0 && (
              <CommandEmpty>No categories found.</CommandEmpty>
            )}
            <CommandGroup className="p-2">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((s) => s !== option.value)
                        : [...selected, option.value],
                    );
                  }}
                  className="rounded-2xl py-3 px-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors"
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      selected.includes(option.value)
                        ? "text-zinc-900"
                        : "text-zinc-600",
                    )}
                  >
                    {option.label}
                  </span>
                  {selected.includes(option.value) && (
                    <Check className="h-4 w-4 text-[#0066FF]" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
