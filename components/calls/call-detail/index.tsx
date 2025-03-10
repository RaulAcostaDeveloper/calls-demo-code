"use client";

import { db } from "@/lib/firebaseClient";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CallDetailPage } from "./CallDetailPage";
import { CallData } from "./CallDetail.model";

export default function CallDetailConnector() {
  const { callId } = useParams();
  const [callDetails, setCallDetails] = useState<CallData>();
  const [formDetails, setFormDetails] = useState<CallData>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const collectionName = process.env.NEXT_PUBLIC_CALLS_COLLECTION_NAME || '';

    const callDocRef = doc(db, collectionName, callId.toString());

    // handing listener using onSnapshot from firestore
    const unsubscribe = onSnapshot(callDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCallDetails({ id: snapshot.id, ...data });
      } else {
        console.error("Call not found");
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to call details:", error);
    });

    return () => unsubscribe();
  }, [callId]);

  useEffect(() => {
    const fetchCallDetails = async () => {
      setIsLoading(true);

      const collectionName = process.env.NEXT_PUBLIC_CALLS_COLLECTION_NAME || '';

      try {
        const callDocRef = doc(db, collectionName, callId.toString());
        const callSnapshot: any = await getDoc(callDocRef);

        if (callSnapshot.exists()) {
          const data = callSnapshot.data();
          setFormDetails({ id: callSnapshot.id, ...data });
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

  if (!callDetails || !formDetails) {
    return <p className="text-center">No details available for this call.</p>;
  }

  return (
    <div>
      <CallDetailPage callDetails={callDetails} formDetails={formDetails}/>
    </div>
  );
}
