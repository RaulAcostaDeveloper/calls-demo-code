"use client";

import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CallDetailPage } from "./CallDetailPage";

export default function CallDetailConnector() {
  const { callId } = useParams();
  const [callDetails, setCallDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCallDetails = async () => {
      setIsLoading(true);

      const collectionName = process.env.NEXT_PUBLIC_CALLS_COLLECTION_NAME || '';

      try {
        const callDocRef = doc(db, collectionName, callId.toString()); // use callId as document ID
        const callSnapshot: any = await getDoc(callDocRef);

        if (callSnapshot.exists()) {
          const data = callSnapshot.data();
          setCallDetails({ id: callSnapshot.id, ...data });
        } else {
          console.error("Call not found");
        }
      } catch (error) {
        console.error("Error fetching call details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallDetails();
  }, [callId]);

  if (isLoading) {
    return <LoaderCircle className="h-12 w-12 animate-spin" />;
  }

  if (!callDetails) {
    return <p className="text-center">No details available for this call.</p>;
  }

  return (
    <div>
      <CallDetailPage callDetails={callDetails} />
    </div>
  );
}
