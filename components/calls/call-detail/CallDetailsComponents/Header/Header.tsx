import { useEffect, useState } from 'react';
import Image from 'next/image';
import './Header.css';

interface Props {
    phoneNumber?: string | undefined;
    location?: string | undefined;
    callDate?: string | undefined;
    callStartTime?: string | undefined;
    instructionLabels?: string[] | undefined;
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

function extractTimeParts(timeString: string): { time: string; period: string; zone: string } | null {
    const timeMatch = timeString.match(/(\d{1,2}:\d{2})(AM|PM)\s+(.*)/);

    if (!timeMatch) {
        console.error("Call start time format is not valid");
        return null;
    }

    const [, time, period, zoneAbbreviation] = timeMatch;

    let zone = "";
    // Add new time zones here
    switch (zoneAbbreviation) {
        case "CT":
            zone = "Central";
            break;
        case "ET":
            zone = "Eastern";
            break;
        case "PT":
            zone = "Pacific";
            break;
        case "MT":
            zone = "Mountain";
            break;
        case "GMT":
            zone = "Greenwich Mean Time";
            break;
        case "UTC":
            zone = "Coordinated Universal Time";
            break;
        case "BST":
            zone = "British Summer Time";
            break;
        case "CET":
            zone = "Central European Time";
            break;
        case "IST":
            zone = "India Standard Time";
            break;
        case "JST":
            zone = "Japan Standard Time";
            break;
        case "AEDT":
            zone = "Australian Eastern Daylight Time";
            break;
        case "AEST":
            zone = "Australian Eastern Standard Time";
            break;
        default:
            zone = zoneAbbreviation;
    }

    return { time, period, zone };
}

export const Header = ({ phoneNumber, location, callDate, callStartTime, instructionLabels }: Props) => {
    const [time, setTime] = useState('');
    const [period, setPeriod] = useState('');
    const [zone, setZone] = useState('');

    useEffect(() => {
        if (callStartTime) {
            const result = extractTimeParts(callStartTime);

            if (result?.time) {
                setTime(result.time);
            }

            if (result?.period) {
                setPeriod(result.period);
            }

            if (result?.zone) {
                setZone(result.zone);
            }
        }
    }, [callStartTime]);

    const copyContent = async (text: string) => {
        if (typeof navigator !== "undefined") {
            await navigator.clipboard.writeText(text);
        }
    }

    return (
        <div className="callDetailHeaderStyle">
            <div className='topHeader'>
                <div className='float'>
                    {phoneNumber && (
                        <button className='phoneNumber' onClick={()=> copyContent(phoneNumber)}>
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
                    {callStartTime && (
                        <div className='callStartTime'>
                            {(time && period && zone) ? (
                                <>
                                    <div className='timeAndPeriod'>{time} {period} </div>
                                    <div className='zone'>{zone}</div>
                                </>
                            ) : (
                                <>{callStartTime}</>
                            )}
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