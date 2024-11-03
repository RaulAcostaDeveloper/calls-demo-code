'use client'
import { useEffect } from 'react';
import './FocusAreaSection.css';
import { InformationFocusArea } from './InformationFocusArea';

interface Props {
    focusAreaSection: any[] | undefined;
}

export const FocusAreaSection = ({ focusAreaSection }: Props) => {
    
    useEffect(() => {
        console.log('focusAreaSection: ', focusAreaSection);
    }, [focusAreaSection]);

    return (
        <div className="focusAreaSection">
            {focusAreaSection?.map((el, index) => (
                <InformationFocusArea key={index} title={el.title} html={el.html} />
            ))}
        </div>
    )
}