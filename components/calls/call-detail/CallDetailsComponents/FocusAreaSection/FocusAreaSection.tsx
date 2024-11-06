'use client'
import { FocusAreaSectionModel } from '../../CallDetail.model';
import './FocusAreaSection.css';
import { InformationFocusArea } from './InformationFocusArea';

interface Props {
    focusAreaSection?: FocusAreaSectionModel[];
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