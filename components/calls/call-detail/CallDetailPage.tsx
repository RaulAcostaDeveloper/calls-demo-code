'use client'
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { hasAccessToLocation, useAuth } from "@/providers/auth-provider";
import {
    collection,
    getDocs,
} from "firebase/firestore";
import { CallData, RowElements } from "./CallDetail.model"
import { Header } from "./CallDetailsComponents/Header/Header";
import './CallDetailStyle.css';
import { FocusAreaSection } from "./CallDetailsComponents/FocusAreaSection/FocusAreaSection";
import { RightAreaSection } from "./CallDetailsComponents/RightAreaSection/RightAreaSection";

interface Props {
    callDetails: CallData;
}

function formatDate(inputDate: string): string {
    const date = new Date(inputDate);

    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "short",
        day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
}

export const CallDetailPage = ({ callDetails }: Props) => {
    const [locationsMap, setLocationsMap] = useState<{ [key: string]: any }>({});
    const [userLocation, setUserLocation] = useState('');
    const [callFormatedDate, setCallFormatedDate] = useState('');
    const { userDetails } = useAuth();

    useEffect(() => {
        const fetchLocations = async () => {
            const locationsRef = collection(
                db,
                process.env.NEXT_PUBLIC_LOCATIONS_COLLECTION_NAME || ""
            );

            const locationsSnapshot = await getDocs(locationsRef);

            const allLocations = locationsSnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const permittedLocations = allLocations.filter((loc) => {
                return hasAccessToLocation(
                    userDetails?.access_control_list || [],
                    loc.access_control_list || []
                );
            });

            const locationsMapObj = permittedLocations.reduce((acc, loc) => {
                acc[loc.id] = loc.display_name;
                return acc;
            }, {} as { [key: string]: string });

            setLocationsMap(locationsMapObj);
        };

        if (userDetails) {
            fetchLocations();
        }
    }, [userDetails]);

    useEffect(() => {
        if (callDetails.call_date) {
            setCallFormatedDate(formatDate(callDetails.call_date))
        }
    }, [callDetails.call_date])

    useEffect(() => {
        if (callDetails.location_id && locationsMap) {
            setUserLocation(`${locationsMap[callDetails.location_id] || "Unknown Location"}`);
        }
    }, [callDetails.location_id, locationsMap]);

    const handleSaveForm = (data: RowElements[]) => {
        // SEND DATA FORM
        console.log('extractedArray: ', data);
    }

    return (
        <div className="callDetailPageStyle">
            <Header
                phoneNumber={callDetails.phone_number}
                location={userLocation}
                callDate={callFormatedDate}
                callStartTime={callDetails.call_start_time}
                instructionLabels={callDetails.instruction_labels} />
            <div className="bottomArea">
                <FocusAreaSection focusAreaSection={callDetails.focus_area_section} />
                <RightAreaSection 
                    callDetails={callDetails} 
                    handleSaveForm={handleSaveForm} />
            </div>
        </div>
    )
}