import { useEffect, useState } from "react";
import { InputButtonSchema, RowElements } from "../../../CallDetail.model";
import './FormSection.css';

interface Props {
    inputButtonsSchema?: InputButtonSchema[];
    inputButtonsData?: (string | boolean)[];
}

export const FormSection = ({ inputButtonsData, inputButtonsSchema }: Props) => {
    const [extractedArray, setExtractedArray] = useState<Array<RowElements>>();

    useEffect(() => {

        if (inputButtonsSchema && inputButtonsData) {
            let elements: RowElements[] = [];

            inputButtonsSchema?.map(group => {
                const rowsArray = Object.values(group.rows);
                rowsArray.map(row => row.map(el => elements.push(el)));
            });

            for (let index = 0; index < elements.length; index++) {
                Object.entries(inputButtonsData).forEach(([key, value]) => {

                    if (key === elements[index].key_name) {
                        elements[index].value = value;
                    }

                });
            }
            setExtractedArray(elements);
        }
    }, [inputButtonsData, inputButtonsSchema]);

    const handleToggleBooleanButton = (index: number) => {
        if (extractedArray) {
            const elements = extractedArray?.map(el => el);
            elements[index].value = !elements[index].value;
            setExtractedArray(elements);
        }
    }

    const handleChangeText = (index: number, value: string) => {
        if (extractedArray) {
            const elements = extractedArray?.map(el => el);
            elements[index].value = value;
            setExtractedArray(elements);
        }
    }

    const handleSave = () => {
        // SEND DATA
        console.log('extractedArray: ', extractedArray);

    }

    return (
        <div className="formSection">
            {extractedArray &&
                <>
                    {extractedArray.map((element, index) => (
                        <div key={index + element.display_text}>
                            {element.type === "clickable_button" &&
                                <button
                                    className={`
                                        ${element.value ? 'buttonSelected' : ''} clickeableButton`} 
                                    onClick={() => handleToggleBooleanButton(index)}>{element.display_text}</button>
                            }
                            {element.type === "text_field_short" &&
                                <div className="inputForm">
                                    <span>{element.display_text}</span>
                                    <input type="text" onChange={(e) => handleChangeText(index, e.target.value)} />
                                </div>
                            }
                            {element.type === "text_field_long" &&
                                <div className="inputForm">
                                    <span>{element.display_text}</span>
                                    <textarea onChange={(e) => handleChangeText(index, e.target.value)} />
                                </div>
                            }
                        </div>
                    ))}
                </>
            }
            <div className="buttons">
                <button className="cancel">Cancel</button>
                <button className="save" onClick={handleSave}>Save</button>
            </div>
        </div>
    )
}