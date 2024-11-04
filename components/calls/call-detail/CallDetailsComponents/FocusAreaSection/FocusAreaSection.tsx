'use client'
import './FocusAreaSection.css';
import { InformationFocusArea } from './InformationFocusArea';

interface Props {
    focusAreaSection: any[] | undefined;
}

export const FocusAreaSection = ({ focusAreaSection }: Props) => {
    return (
        <div className="focusAreaSection">
            {focusAreaSection?.map((el, index) => (
                <InformationFocusArea key={index} title={el.title} html={el.html} />
            ))}
        </div>
    )
}