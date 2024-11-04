'use client'
import { CallData } from '../../CallDetail.model';
import { FormSection } from './FormSection/FormSection';
import './RightAreaSection.css';

interface Props {
    callDetails: CallData;
}

export const RightAreaSection = ({ callDetails }: Props) => {
    return (
        <div className="rightAreaSection">
            <div className='inner'>
                <FormSection
                    inputButtonsData={callDetails.input_buttons_data}
                    inputButtonsSchema={callDetails.input_buttons_schema} />
            </div>
        </div>
    )
}