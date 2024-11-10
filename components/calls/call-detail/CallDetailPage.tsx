"use client"
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { hasAccessToLocation, useAuth } from "@/providers/auth-provider";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { CallData, RowElements } from "./CallDetail.model"
import { Header } from "./CallDetailsComponents/Header/Header";
import './CallDetailStyle.css';
import { FocusAreaSection } from "./CallDetailsComponents/FocusAreaSection/FocusAreaSection";
import { RightAreaSection } from "./CallDetailsComponents/RightAreaSection/RightAreaSection";
import { HttpService } from "@/lib/modules/http/service";
import { Toaster, toast } from "sonner";
import { getUserToken } from "@/app/(auth)/sign-in/page";

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
    const httpService = new HttpService();

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
        // This is the FORM service
        // Delete logs when service is working
        try {
            const callId: string = callDetails.id || "";
            const bodyRequest = formatFormData(data);
            const body = {
                input_buttons_data: bodyRequest,
                call_id: callId
            };
            const uri = `${process.env.NEXT_PUBLIC_CALLS_URL}/call_details/input`;
            // uri options
            // const uri2 = 'https://abgdcx.aws.com/call_details/input';
            // const uri3 = 'https://abgdcx.aws.com/base_url/call_details/input';
            // const uri4 = 'https://abgdcx.aws.com/call_now/call_details/input';
            // const uri5 = 'https://abgdcx.aws.com/call_now/base_url/call_details/input';

            console.log('FORM ACTION URI: ', uri);
            console.log('FORM ACTION BODY: ', body);

            const response = await httpService.post(uri, body);
            console.log(response);
        }
        catch (e) {
            console.error('error: ', e);
        }
    }

    const handleActionButtonClick = (id: string) => {
        const body = {
            token: getUserToken(),
            call_id: callDetails.id,
            info_button_id: id
        };

        toast.promise(async () => {
            const uri = `${process.env.NEXT_PUBLIC_CALLS_URL}/call_details/action`;
            console.log('BUTTON ACTION URI: ', uri);
            console.log('BUTTON ACTION BODY: ', body);

            const response = await httpService.post(uri, body)
            if (!response) {
                throw new Error(`Error call details: ${response}`);
            }
        }, {
            loading: "Call details fetchin...",
            success: "Call details founded",
            error: "Call details error",
        });
    }

    const handleInfoButtonClick = (id: string) => {
        const body = {
            token: getUserToken(),
            call_id: callDetails.id,
            info_button_id: id
        };

        toast.promise(async () => {
            const uri = `${process.env.NEXT_PUBLIC_CALLS_URL}/call_details/info`;
            console.log('BUTTON INFO URI: ', uri);
            console.log('BUTTON INFO BODY: ', body);

            const response = await httpService.post(uri, body)
            if (!response) {
                throw new Error(`Error call details: ${response}`);
            }
        }, {
            loading: "Call details fetchin...",
            success: "Call details founded",
            error: "Call details error",
        });
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