import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from "sonner";
import './Header.css';

interface Props {
    phoneNumber?: string;
    location?: string;
    callDate?: string;
    instructionLabels?: string[];
    timezone?: string;
}

const formatPhoneNumber = (phoneNumber: string) => {
    const cleanedNumber = phoneNumber.replace("+1", "");

    if (/^[0-9+-]+$/.test(cleanedNumber) && cleanedNumber.length === 10) {
        return `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(
            3,
            6
        )}-${cleanedNumber.slice(6, 10)}`;
    } else {
        return phoneNumber;
    }
}

export const Header = ({ phoneNumber, location, callDate, instructionLabels, timezone }: Props) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateTime = () => {
                const now = new Date();
                const formattedTime = now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
                setCurrentTime(formattedTime);
            };

            updateTime();

            const interval = setInterval(updateTime, 1000);

            return () => clearInterval(interval);
        }
    }, []);

    const copyContent = async (text: string) => {
        if (typeof navigator !== "undefined") {
            await navigator.clipboard.writeText(text);
            toast.success("Copied " + text);
        }
    }

    return (
        <div className="callDetailHeaderStyle">
            <div className='topHeader'>
                <div className='float'>
                    {phoneNumber && (
                        <button className='phoneNumber' onClick={() => copyContent(phoneNumber)}>
                            {formatPhoneNumber(phoneNumber)}
                            <Image src={'/assets/copyIcon.png'} width={30} height={30} alt='copy icon' />
                        </button>
                    )}
                    {location && (
                        <div className='location'>{location}</div>
                    )}
                </div>

                <div className='float'>
                    {callDate && (
                        <div className='callDate'>{callDate}</div>
                    )}
                    {currentTime && (
                        <div className='callStartTime'>
                            <div className='timeAndPeriod'>{currentTime} </div>
                            <div className='zone'>{timezone}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className='bottomHeader'>
                {instructionLabels && (
                    <>
                        {instructionLabels.map((label, index) => (
                            <p className='label' key={index + label}>{label}</p>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}