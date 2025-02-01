"use client"

import { InputType } from "@/src/types";

export default function Input ({ placeholder, value, onChange, type, className }: InputType) {
    return(
            <input placeholder={placeholder} value={value} onChange={onChange} type={type} className={className}></input> 
    )
}