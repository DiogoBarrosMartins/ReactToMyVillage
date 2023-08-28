import '../css/InfoCard.css';
const InfoCard: React.FC<{ info: string, onClose: () => void }> = ({ info, onClose }) => {
    return (
        <div className="info-card">
            <div className="info-card-content">
                {info}
            </div>
            <button onClick={onClose} className="info-card-close">Close</button>
        </div>
    );
};
export default InfoCard;