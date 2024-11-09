import { useEffect, useState } from "react";
import { InputButtonSchema, RowElements } from "../../../CallDetail.model";
import { ModalCancelWithoutSaving } from "./ModalCancelWithoutSaving/ModalCancelWithoutSaving";
import './FormSection.css';

interface Props {
    inputButtonsSchema?: InputButtonSchema[];
    inputButtonsData?: Record<string, string | boolean>;
    handleSaveForm: (data: RowElements[]) => void;
}

const updateRenderedElements = (inputButtonsSchema: InputButtonSchema[], inputButtonsData: Record<string, string | boolean>): InputButtonSchema[] => {
    const newArr: InputButtonSchema[] = [];

    for (let index = 0; index < inputButtonsSchema.length; index++) {
        const rowsArray = Object.values(inputButtonsSchema[index].rows);

        newArr[index] = {
            title: inputButtonsSchema[index].title,
            rows: rowsArray,
        };

        for (let indexRows = 0; indexRows < newArr[index].rows.length; indexRows++) {
            for (let indexButton = 0; indexButton < newArr[index].rows[indexRows].length; indexButton++) {

                // Map values
                Object.entries(inputButtonsData).forEach(([key, value]) => {
                    if (key === newArr[index].rows[indexRows][indexButton].key_name) {
                        newArr[index].rows[indexRows][indexButton].value = value;
                    }
                });

            }
        }
    }
    return newArr;
}

export const FormSection = ({ inputButtonsData, inputButtonsSchema, handleSaveForm }: Props) => {
    const [extractedArray, setExtractedArray] = useState<Array<RowElements>>();
    const [renderedElements, setRenderedElements] = useState<Array<InputButtonSchema>>();
    const [updatedInputButtonsData, setUpdatedInputButtonsData] = useState<Record<string, string | boolean>>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setUpdatedInputButtonsData(inputButtonsData);
    }, [inputButtonsData]);

    useEffect(() => {
        if (inputButtonsSchema && updatedInputButtonsData) {
            setRenderedElements(updateRenderedElements(inputButtonsSchema, updatedInputButtonsData));
        }
    }, [inputButtonsSchema, updatedInputButtonsData]);

    useEffect(() => {
        if (renderedElements) {
            let elements: RowElements[] = [];

            renderedElements?.map(group => {
                const rowsArray = Object.values(group.rows);
                rowsArray.map(row => row.map(el => elements.push(el)));
            });

            setExtractedArray(elements);
        }
    }, [renderedElements]);

    const handleToggleBooleanButton = (keyName: string) => {
        if (updatedInputButtonsData) {
            const temporalObject = { ...updatedInputButtonsData };

            if (keyName in temporalObject) {
                temporalObject[keyName] = !temporalObject[keyName];
                setUpdatedInputButtonsData(temporalObject);
            }
        }
    }

    const handleChangeText = (keyName: string, value: string) => {
        if (updatedInputButtonsData) {

            const temporalObject = { ...updatedInputButtonsData };

            if (keyName in temporalObject) {
                temporalObject[keyName] = value;
                setUpdatedInputButtonsData(temporalObject);
            }
        }
    }

    const handleSave = () => {
        if (extractedArray) {
            handleSaveForm(extractedArray);
        } else {
            console.error('Not data found')
        }
    }

    return (
        <div className="formSection">
            {renderedElements &&
                <>
                    {renderedElements.map((schema, index) => {
                        const rows = Object.values(schema.rows);
                        return (
                            <div key={index}>
                                <h2 className="title">{schema.title}</h2>
                                {rows.map((el, index) => (
                                    <div className="row" key={index + schema.title}>
                                        {el.map(element => (
                                            <div key={element.key_name}>

                                                {element.type === "clickable_button" &&
                                                    <button
                                                        className={`${element.value ? 'buttonSelected' : ''} clickeableButton`}
                                                        onClick={() => handleToggleBooleanButton(element.key_name)}>
                                                        {element.display_text}
                                                    </button>
                                                }

                                                {element.type === "text_field_short" &&
                                                    <div className="inputForm">
                                                        <span>{element.display_text}</span>
                                                        <input
                                                            maxLength={1024}
                                                            value={`${element.value ? element.value : ''}`}
                                                            type="text" onChange={(e) => handleChangeText(element.key_name, e.target.value)} />
                                                    </div>
                                                }

                                                {element.type === "text_field_long" &&
                                                    <div className="inputForm">
                                                        <span>{element.display_text}</span>
                                                        <textarea
                                                            maxLength={1024}
                                                            value={`${element.value ? element.value : ''}`}
                                                            onChange={(e) => handleChangeText(element.key_name, e.target.value)} />
                                                    </div>
                                                }

                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </>
            }

            <div className="buttons">
                <button className="cancel" onClick={() => setIsModalOpen(true)}>Cancel</button>
                <button className="save" onClick={handleSave}>Save</button>
            </div>

            {isModalOpen && <ModalCancelWithoutSaving setIsModalOpen={() => setIsModalOpen(false)} />}

        </div>
    )
}