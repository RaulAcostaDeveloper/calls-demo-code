import { InfoButtonSection } from '../../../CallDetail.model';
import './InfoButtonsSection.css';

interface Props {
    buttons?: InfoButtonSection[];
    handleButtonClick: (buttonId: string, option: string) => void;
}

export const InfoButtonsSection = ({ buttons, handleButtonClick }: Props) => {

    const handleClickButton = (buttonId: string) => {
        handleButtonClick(buttonId, 'info');
    }
    
    return (
        <div className='infoButtonsSection'>
            {buttons &&
                <>
                {buttons.map((row, index) => {
                    const rowsArray = Object.values(row.rows);
                    return (
                        <div key={index + row.title} className='row'>
                            <h2 className='titleButtonsSection'>{row.title}</h2>
                            {rowsArray.map((element, index) => (
                                <div key={index + index} className='buttonsContainer'>
                                    {element.map( buttons =>(
                                        <button key={buttons.id} className='buttonSection' onClick={()=>handleClickButton(buttons.id)}>{buttons.display_text}</button>
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