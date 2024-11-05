import './ModalCancelWithoutSaving.css';
interface Props {
    setIsModalOpen: () => void;
}
export const ModalCancelWithoutSaving = ({ setIsModalOpen }: Props) => {
    const handleModalYes = () => {
        if (typeof navigator !== "undefined") {
            window.history.back();
        }
    }
    return (
        <div className="modalCancelWithoutSaving">
            <div className="innerModal">
                <h2 className='titleModal'>Cancel Without Saving?</h2>
                <p className='textModal'>Do You Want To Discard The Changes You Made?</p>
                <div className="buttonsModal">
                    <button className="yesButtonModal" onClick={handleModalYes}>Yes</button>
                    <button className="noButtonModal" onClick={setIsModalOpen}>No, Go Back</button>
                </div>
            </div>
        </div>
    )
}