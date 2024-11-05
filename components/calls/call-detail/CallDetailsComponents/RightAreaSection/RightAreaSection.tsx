'use client'
import { CallData, RowElements } from '../../CallDetail.model';
import { FormSection } from './FormSection/FormSection';
import { InfoButtonsSection } from './InfoButtonsSection/InfoButtonsSection';
import './RightAreaSection.css';

interface Props {
    callDetails: CallData;
    handleSaveForm: (data: RowElements[]) => void;
}

export const RightAreaSection = ({ callDetails, handleSaveForm }: Props) => {
    return (
        <div className="rightAreaSection">
            <div className='inner'>
                <FormSection
                    inputButtonsData={callDetails.input_buttons_data}
                    inputButtonsSchema={callDetails.input_buttons_schema}
                    handleSaveForm={handleSaveForm} />
                <InfoButtonsSection buttons={callDetails.info_buttons_section} />
            </div>
        </div>
    )
}