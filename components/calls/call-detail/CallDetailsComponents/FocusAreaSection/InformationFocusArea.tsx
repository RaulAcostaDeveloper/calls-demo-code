'use client'

import { useState } from "react";

interface Props {
    title: string;
    html: string;
}

export const InformationFocusArea = ({ title, html }: Props) => {
    const [open, setOpen] = useState(true);

    return (
        <div className='section'>

            <div className='titleSection' onClick={() => setOpen(!open)}>
                <p className='title'>{title}</p>
                <img src="/assets/arrowDownIcon.png" alt='Arrow Down Icon' />
            </div>

            {/* There is not specifit html so it is impossible to style from here */}
            {open && <div dangerouslySetInnerHTML={{ __html: html }} className="noSpecificHtml" />}
        </div>
    )
}