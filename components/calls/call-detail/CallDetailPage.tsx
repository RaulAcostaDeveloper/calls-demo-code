"use client"
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { hasAccessToLocation, useAuth } from "@/providers/auth-provider";
import { collection, getDocs } from "firebase/firestore";
import { CallData, RowElements } from "./CallDetail.model"
import { Header } from "./CallDetailsComponents/Header/Header";
import './CallDetailStyle.css';
import { FocusAreaSection } from "./CallDetailsComponents/FocusAreaSection/FocusAreaSection";
import { RightAreaSection } from "./CallDetailsComponents/RightAreaSection/RightAreaSection";
import { postButtonsService, postFormService } from "@/lib/modules/http/service";
import { Toaster } from "sonner";
import { ButtonsBodyService, ToastMessages } from "@/lib/modules/http/services.model";

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

function formatFormData(data: RowElements[]) {
    let result = {};
    data.forEach(Row => {
        if (Row.key_name) {
            result = { ...result, [Row.key_name]: Row.value };
        }
    });
    return result;
}

export const CallDetailPage = ({ callDetails }: Props) => {
    const [locationsMap, setLocationsMap] = useState<{ [key: string]: any }>({});
    const [userLocation, setUserLocation] = useState('');
    const [callFormatedDate, setCallFormatedDate] = useState('');
    const [timezone, setTimezone] = useState('');
    const [headerHeight, setHeaderHeight] = useState(0);
    const { userDetails, user } = useAuth();

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
                if (loc.id === callDetails.location_id) {
                    setTimezone(loc.timezone)
                }
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

    const handleSaveForm = async (data: RowElements[]) => {
        const userToken = await user?.getIdToken();
        const bodyRequest = formatFormData(data);
        const uri = `input_request`;
        const toastMessages: ToastMessages = {
            loading: 'Saving data',
            success: 'Successfully saved data',
            error: 'Failed to save data, please try again or press Cancel',
        }
        const body = {
            id: "",
            call_id: callDetails.id,
            location_id: callDetails.location_id,
            phone_number: callDetails.phone_number,
            other_info: "",
            input_buttons_data: bodyRequest,
        };
        const response = await postFormService(uri, body, toastMessages, userToken);
        if (response === "success") {
            if (typeof navigator !== "undefined") {
                window.history.back();
            }
        }
    }

    const handleActionButtonClick = async (id: string) => {
        const userToken = await user?.getIdToken();
        const uri = `action_request`;
        const toastMessages: ToastMessages = {
            loading: 'Sending request for action',
            success: 'Successfully sent request for action',
            error: 'Failed to send request for action, please try again',
        }
        const body: ButtonsBodyService = {
            id,
            call_id: callDetails.id,
            location_id: callDetails.location_id,
            phone_number: callDetails.phone_number,
            other_info: ""
        };
        postButtonsService(uri, body, toastMessages, userToken);
    }

    const handleInfoButtonClick = async (id: string) => {
        const userToken = await user?.getIdToken();
        const uri = `info_request`;
        const toastMessages: ToastMessages = {
            loading: 'Sending request for action',
            success: 'Successfully sent request for action',
            error: 'Failed to send request for action, please try again',
        }
        const body = {
            id,
            call_id: callDetails.id,
            location_id: callDetails.location_id,
            phone_number: callDetails.phone_number,
            other_info: ""
        };
        postButtonsService(uri, body, toastMessages, userToken);
    }

    return (
        <div className="callDetailPageStyle">

            <Toaster
                position="top-right"
                richColors
                toastOptions={{
                    style: {
                        fontSize: "20px",
                        background: "#333",
                        color: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                }}
            />

            <Header
                phoneNumber={callDetails.phone_number}
                location={userLocation}
                callDate={callFormatedDate}
                instructionLabels={callDetails.instruction_labels}
                timezone={timezone}
                setHeaderHeight={setHeaderHeight} />

            <div className="bottomArea" style={{ marginTop: `${headerHeight}px` }}>
                <FocusAreaSection focusAreaSection={callDetails.focus_area_section} />
                <RightAreaSection
                    callDetails={callDetails}
                    handleSaveForm={handleSaveForm}
                    handleActionButtonClick={handleActionButtonClick}
                    handleInfoButtonClick={handleInfoButtonClick} />
            </div>
        </div>
    )
}