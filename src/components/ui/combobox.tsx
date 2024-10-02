"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const markets = [
  {
    value: ":NASDAQ",
    label: "NASDAQ",
  },
  {
    value: ":BSE",
    label: "BSE",
  },
  {
    value: ":NSE",
    label: "NSE",
  }
]

export function Combobox() {
  // Set the default value to "NASDAQ"
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(":NASDAQ")  // Default to NASDAQ

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[160px] justify-between"
        >
          {value
            ? markets.find((market) => market.value === value)?.label
            : "Select market"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search market" />
          <CommandList>
            <CommandEmpty>No market found.</CommandEmpty>
            <CommandGroup>
              {markets.map((market) => (
                <CommandItem
                  className="dark:text-[#ffffff]"
                  key={market.value}
                  value={market.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === market.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {market.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
