import { useState } from "react";

const BR_MASK = "(XX) XXXXX-XXXX";

function formatPhone(digits: string): string {
    let result = "";
    let di = 0;
    for (let mi = 0; mi < BR_MASK.length && di < digits.length; mi++) {
        if (BR_MASK[mi] === "X") {
            result += digits[di++];
        } else {
            result += BR_MASK[mi];
        }
    }
    return result;
}

export function PhoneInput({
    value,
    onChange,
    label,
    placeholder = "+55 (21) 99999-9999",
}: {
    value: string;
    onChange: (val: string) => void;
    label?: string;
    placeholder?: string;
}) {
    const digits = value.replace(/^\+55/, "").replace(/\D/g, "");
    const formatted = digits ? `+55 ${formatPhone(digits)}` : "";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.replace(/\D/g, "").replace(/^55/, "");
        onChange(raw ? `+55${raw}` : "");
    }

    return (
        <div>
            {label && (
                <label className="block text-xs tracking-widest uppercase text-[#a8a8a8] mb-2">
                    {label}
                </label>
            )}
            <input
                type="tel"
                inputMode="numeric"
                value={formatted}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-[#272727] ring-1 ring-white/10 rounded-sm px-4 py-3 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all duration-200"
            />
        </div>
    );
}