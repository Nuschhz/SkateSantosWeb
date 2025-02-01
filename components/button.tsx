"use-client"

import { IndexButton } from "@/src/types";

export default function Button ({title, onClick, className, disabled, type}: IndexButton) {
    return(
            <button disabled={disabled} type={type} onClick={onClick} className={className}>
                {title}
            </button> 
    )
}