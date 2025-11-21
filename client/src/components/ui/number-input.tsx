import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number
  onChange?: (value: number) => void
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value = 0, onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(String(value))

    React.useEffect(() => {
      setDisplayValue(String(value))
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      if (inputValue === "") {
        setDisplayValue("0")
        onChange?.(0)
        return
      }

      // Strip leading zeros (but keep single 0)
      let cleanValue = inputValue
      if (inputValue.startsWith("0") && inputValue.length > 1 && !inputValue.includes(".")) {
        cleanValue = inputValue.replace(/^0+/, "")
      }

      const numValue = Number(cleanValue)
      setDisplayValue(cleanValue)
      onChange?.(numValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        const inputs = Array.from(
          document.querySelectorAll("input:not([disabled]), select:not([disabled]), textarea:not([disabled])")
        )
        const index = inputs.indexOf(e.currentTarget)
        if (index > -1 && index < inputs.length - 1) {
          const next = inputs[index + 1] as HTMLElement
          next.focus()
        } else {
          e.currentTarget.blur()
        }
      }
      props.onKeyDown?.(e)
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn("font-mono", className)}
        {...props}
      />
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
