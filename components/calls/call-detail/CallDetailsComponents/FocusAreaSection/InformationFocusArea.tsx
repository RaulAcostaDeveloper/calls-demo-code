'use client'

import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';

interface Props {
    title: string;
    html: string;
}

export const InformationFocusArea = ({ title, html }: Props) => {
    const [open, setOpen] = useState(true);
    const [sanitizedHtml, setSanitizedHtml] = useState('');

    useEffect(() => {
        setSanitizedHtml(DOMPurify.sanitize(html));
    }, [html]);

    return (
        <div className='section'>

            <div className='titleSection' onClick={() => setOpen(!open)}>
                <p className='title'>{title}</p>
                <img src="/assets/arrowDownIcon.png" alt='Arrow Down Icon' />
            </div>
            {open && <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} className="noSpecificHtml" />}

        </div>
    )
}