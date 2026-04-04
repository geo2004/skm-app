"use client"

interface Props {
  value: number
  label: string
  selected: boolean
  onChange: (val: number) => void
}

export default function LikertOption({ value, label, selected, onChange }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm min-h-[52px] ${
        selected
          ? "border-transparent text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-[#0E5B73]"
      }`}
      style={selected ? { background: "#0E5B73", borderColor: "#0E5B73" } : {}}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mr-3 shrink-0 ${
          selected ? "bg-white" : "bg-gray-100 text-gray-500"
        }`}
        style={selected ? { color: "#0E5B73" } : {}}
      >
        {value}
      </span>
      {label}
    </button>
  )
}
