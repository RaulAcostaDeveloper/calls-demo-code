import { ActionButtonSection } from "../../../CallDetail.model";
import './ActionButtonsSection.css';

interface Props {
    buttons?: ActionButtonSection[];
    handleButtonClick: (buttonId: string, option: string) => void;
}

export const ActionButtonsSection = ({ buttons, handleButtonClick }: Props) => {
    return (
        <div className="actionButtonsSection">
            {buttons &&
                <>
                    {buttons.map((row, index) => {
                        const rowsArray = Object.values(row.rows);
                        return (
                            <div key={index + row.title + index}>
                                <h2 className="titleRow">{row.title}</h2>
                                {rowsArray.map((elements, index) => (
                                    <div key={index + row.title} className="buttonsRow">
                                        {elements.map((buttons, index) => (
                                            <button 
                                                key={index + buttons.display_text} 
                                                onClick={() => handleButtonClick(buttons.id, 'action')}>
                                                    {buttons.display_text}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </>
            }
        </div>
    )
}