import { InfoButtonSection } from '../../../CallDetail.model';
import './InfoButtonsSection.css';
interface Props {
    buttons?: InfoButtonSection[];
}
export const InfoButtonsSection = ({ buttons }: Props) => {
    console.log('buttons: ', buttons);
    
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
                                        <button key={buttons.id} className='buttonSection'>{buttons.display_text}</button>
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