"use client";

import {
  Building,
  Phone,
  PhoneCall,
  Play,
  PauseCircle,
  Headset,
  Voicemail,
  PhoneMissed,
  Loader,
  Ellipsis,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Key, useEffect, useRef, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AgentIcon,
  BusinessIcon,
  InMenuIcon,
  LoaderCustomIcon,
  MissedCallIcon,
} from "@/constants/icons";
import { BsBuildings } from "react-icons/bs";
import { Progress } from "../ui/progress";
import { useAudio } from "./audio-context";

type CallCardProps = {
  call: DocumentData;
  locationsMap: Record<string, string>;
};

const icons = [
  { label: "voicemail", icon: Voicemail, tooltip: "Reached voicemail" },
  {
    label: "business",
    icon: BsBuildings,
    tooltip: "Answered at the location",
  },
  { label: "agent", icon: AgentIcon, tooltip: "Answered by agent" },
  { label: "", icon: MissedCallIcon, tooltip: "Caller hung up" },
];

export default function CallCard({ call, locationsMap }: CallCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timePlayed, setTimePlayed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isShowingTranscript, setIsShowingTranscript] = useState(false);

  const { currentlyPlayingId, play, pause } = useAudio(); // Use the audio context

  useEffect(() => {
    if (call.recording_url) {
      audioRef.current = new Audio(call.recording_url);

      const handleEnded = () => {
        setIsPlaying(false);
        pause();
      };
      const handleTimeUpdate = () =>
        setTimePlayed(audioRef.current?.currentTime || 0);

      audioRef.current.addEventListener("ended", handleEnded);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleEnded);
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [call.recording_url, pause]);

  useEffect(() => {
    if (currentlyPlayingId !== call.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [currentlyPlayingId, call.id, isPlaying]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        pause();
      } else {
        audioRef.current.play();
        play(call.id);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: string) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseInt(value);
      setTimePlayed(parseInt(value));
    }
  };

  const callNowUrl = `${process.env.NEXT_PUBLIC_CALLS_URL}?location_id=${call.location_id}&phone_number=${call.phone_number}`;

  function handleCallNow() {
    toast.promise(
      fetch(callNowUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to call now");
        }
      }),
      {
        loading: "Calling now...",
        success: "Call initiated successfully",
        error: "Failed to initiate call",
      }
    );
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
  };

  return (
    <Card className="w-full p-2 lg:p-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-x-2.5 gap-y-3 sm:gap-3">
            <div className="flex items-center gap-3">
              <p className="text-[13px] md:text-base lg:text-lg font-medium text-[#59AFF3] underline">
                {formatPhoneNumber(call.phone_number)}
              </p>
              <Button
                onClick={handleCallNow}
                className="bg-[#59AFF3] text-white hover:bg-[#4591ca] py-2 px-1.5 h-1 md:py-3.5 md:px-3 lg:rounded-md rounded-sm"
              >
                <Phone className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="font-semibold text-[12.28px] md:text-base">
                  Call now
                </span>
              </Button>
            </div>
            <Badge className="lg:mt-0 rounded-sm font-normal max-md:text-[11px] max-md:px-2 max-md:py-1.5 max-md:h-1">
              {locationsMap[call.location_id] || "Unknown Location"}
            </Badge>
          </div>

          <p
            className={cn(
              "text-[#FFA500] text-[11.16px] sm:text-xs md:text-sm lg:text-base flex justify-center items-center whitespace-nowrap gap-x-2 text-end",
              {
                "text-[#59AFF3]": call.ongoing_call_status === "In menu",
                "text-[#00A807]": call.ongoing_call_status === "Connected",
              }
            )}
          >
            {call.ongoing_call_status && (
              <LoaderCustomIcon
                className={"animate-spin h-3 w-3 lg:w-6 lg:h-6 "}
              />
            )}
            {call.ongoing_call_status}
            {call.ongoing_call_status === "Connecting" ? (
              <PhoneCall className="h-3 w-3 lg:h-5 lg:w-5" />
            ) : call.ongoing_call_status === "In menu" ? (
              <InMenuIcon className="h-3 w-3 lg:h-5 lg:w-5" />
            ) : call.ongoing_call_status === "Connected" ? (
              <Phone className="h-3 w-3 lg:h-5 lg:w-5" />
            ) : null}
          </p>
        </div>
        <div className="flex  items-center justify-between flex-wrap gap-2">
          <div className="flex items-center justify-start gap-2 lg:gap-3 mt-5">
            {icons.map((icon, index) => {
              if (call.icon_type === icon.label) {
                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger>
                        <icon.icon
                          className={cn("h-5 w-5", {
                            "text-[#FF2A2A]": call.icon_type === "",
                          })}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {icon.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }
            })}

            <p className="font-medium text-[13px] md:text-base">
              {call.call_start_time}
            </p>
          </div>
          {call.recording_url && (
            <div className="flex items-center justify-center gap-2 mt-5">
              {/* Play/Pause Button */}
              {isPlaying ? (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="h-5 w-5 sm:h-7 sm:w-7 group rounded-full"
                  onClick={handlePlay}
                >
                  <PauseCircle className="h-5 w-5 sm:h-7 sm:w-7 fill-black rounded-full text-white group-hover:fill-secondary group-hover:text-black transition duration-200 ease-in-out group-hover:bg-gray-200 group-hover:p-1" />
                </Button>
              ) : (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="h-5 w-5 sm:h-7 sm:w-7 group rounded-full"
                  onClick={handlePlay}
                >
                  <Play className="h-5 w-5 sm:h-7 sm:w-7 fill-black rounded-full text-black group-hover:fill-secondary transition duration-200 ease-in-out group-hover:bg-gray-200 group-hover:p-1" />
                </Button>
              )}

              {/* Progress Bar */}
              <input
                type="range"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min="0"
                max={Math.floor(call.call_length_in_seconds)}
                value={timePlayed}
                onChange={(e) => handleSeek(e.target.value)}
                style={{ flexGrow: 1 }} // Responsive width
              />

              {/* Time Display */}
              <p className="text-[10.16px] md:text-base min-w-[40px] text-center">
                {call.call_length_in_seconds !== -1 && !timePlayed
                  ? (() => {
                      const roundedSeconds = Math.round(
                        call.call_length_in_seconds
                      );
                      const minutes = Math.floor(roundedSeconds / 60);
                      const seconds = String(roundedSeconds % 60).padStart(
                        2,
                        "0"
                      );
                      return `${minutes}:${seconds}`;
                    })()
                  : timePlayed
                  ? (() => {
                      const roundedSeconds = Math.round(timePlayed);
                      const minutes = Math.floor(roundedSeconds / 60);
                      const seconds = String(roundedSeconds % 60).padStart(
                        2,
                        "0"
                      );
                      return `${minutes}:${seconds}`;
                    })()
                  : null}
              </p>
            </div>
          )}
        </div>

        {/* Labels Wrapper */}
        {call.labels && call.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 my-4">
            {call.labels.map((label: string, index: Key | null | undefined) => (
              <Badge
                key={index}
                className={cn(
                  "rounded-sm bg-[#EAEAEA] text-black font-normal max-md:text-[11px] hover:bg-[#EAEAEA] py-1.5 px-2 h-2 md:py-2.5 md:px-2",
                  {
                    "bg-[#00A807] text-white": label === "Upsell",
                    "bg-[#FF2A2A] text-white hover:bg-[#FF2A2A]":
                      label === "Complaint",
                  }
                )}
              >
                {label}
              </Badge>
            ))}
          </div>
        )}

        {call.transcript_summary && (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger
                onClick={() => setIsShowingTranscript(!isShowingTranscript)}
                className="text-start font-normal text-base max-md:text-[12px] hover:no-underline"
              >
                {call.transcript_summary}
                <span className="text-[#59AFF3] hover:underline">
                  &nbsp; show {isShowingTranscript ? "less" : "more"}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-4">
                  {call.full_transcript.map(
                    (message: string, index: Key | null | undefined) => {
                      const isTeamMember = message.startsWith("Team member:");
                      return (
                        <div
                          key={index}
                          className={`flex ${
                            isTeamMember ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className="relative max-w-[80%] mx-2">
                            <div
                              className={`relative ${
                                isTeamMember ? "bg-[#D8FDD2]" : "bg-[#F3F3F3]"
                              } p-3 max-md:p-1.5 rounded-lg text-base max-md:text-[12px]`}
                            >
                              {message
                                .replace("Team member:", "")
                                .replace("Guest:", "")}
                              {isTeamMember ? (
                                <div className="absolute top-0 -right-2">
                                  <svg
                                    width="21"
                                    height="10"
                                    viewBox="0 0 14 7"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6.49997 7C6.89997 2.73333 2.5 0.333333 0 0H12.2963C14.2963 0 14.1296 1.33333 13.7963 2L6.49997 7Z"
                                      fill="#D8FDD2"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="absolute top-0 -left-2">
                                  <svg
                                    width="21"
                                    height="10"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M7 9.5C6.61111 3.28551 11.1805 0.485507 13.6111 0H1.65638C-0.288062 0 -0.126024 1.94203 0.19805 2.91304L7 9.5Z"
                                      fill="#F3F3F3"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </Card>
  );
}
