import { ActionButtonSection } from "../../../CallDetail.model";
import './ActionButtonsSection.css';

interface Props {
    buttons?: ActionButtonSection[];
    handleButtonClick: (buttonId: string) => void;
}

export const ActionButtonsSection = ({ buttons, handleButtonClick }: Props) => {
    return (
        <div className="actionButtonsSection">
            {buttons &&
                <>
                    {buttons.map((row, index) => {
                        const rowsArray = Object.values(row.rows);
                        return (
                            <>
                                <h2 className="titleRow">{row.title}</h2>
                                {rowsArray.map((elements, index) => (
                                    <div key={index + row.title} className="buttonsRow">
                                        {elements.map((buttons, index) => (
                                            <button onClick={() => handleButtonClick(buttons.id)}>{buttons.display_text}</button>
                                        ))}
                                    </div>
                                ))}
                            </>
                        )
                    })}
                </>
            }
        </div>
    )
}