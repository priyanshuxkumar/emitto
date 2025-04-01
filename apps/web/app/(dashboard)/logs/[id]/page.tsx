"use client";

import Loader from "@/components/Loader";
import AxiosInstance from "@/utils/axiosInstance";
import { ArrowLeft, Ellipsis, Logs, Mail } from "lucide-react";
import { ParamValue } from "next/dist/server/request/params";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiKeyLogProps } from "../page";
import { timeAgo } from "@/helper/time";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nnfxDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface ApiKeyLogDetailsProps extends ApiKeyLogProps {
  requestBody: Record<string, unknown>;
  responseBody: Record<string, unknown>;
}

const useFetchApiKeyLogDetails = (id: ParamValue) => {
  const [data, setData] = useState<ApiKeyLogDetailsProps>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`/api/apikey/log/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
  };
};

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useFetchApiKeyLogDetails(id);
  return (
    <>
      {isLoading ? (
        <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
          <Loader color="white" strokeWidth="2" size="30" />
        </div>
      ) : (
        <div className="text-white pb-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 py-8">
              <div className="flex items-center gap-4">
                <div
                  className="mr-3 cursor-pointer"
                  onClick={() => router.back()}
                >
                  <ArrowLeft />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-900/20">
                  <Logs className="w-7 h-7 text-white" />
                </div>
                <div>
                    <p className="text-zinc-400 text-sm">Log</p>
                    <h1 className="text-xl font-bold">
                        {data?.method}
                        {data?.endpoint}
                    </h1>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-700/50 gap-2 flex-1 md:flex-none"
                    >
                      <Ellipsis className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit p-1">
                      <Button
                        onClick={() => router.push(`/emails/${data?.responseBody?.id}`)}
                        variant={"ghost"}
                        className="w-full justify-start text-base p-0"
                      >
                        <Mail />
                        Go to Email
                      </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Email Detail */}
            <div className="flex flex-wrap pb-8">
              <div className="mt-8 flex w-full flex-col gap-2 md:basis-1/3">
                <p className="uppercase text-xs">Endpoint</p>
                <span className="mt-1 text-sm">{data?.endpoint}</span>
              </div>
              <div className="mt-8 flex w-full flex-col gap-2 md:basis-1/3">
                <p className="uppercase text-xs">Status</p>
                <span
                  className={clsx(
                    "px-2 py-1 rounded-sm text-sm w-fit",
                    data?.responseStatus == 200
                      ? "bg-green-800"
                      : "bg-yellow-500"
                  )}
                >
                  {data?.responseStatus}
                </span>
              </div>
              <div className="mt-8 flex w-full flex-col gap-2 md:basis-1/3">
                <p className="uppercase text-xs">Creation Date</p>
                <span className="mt-1 text-sm text-slate-12">
                  {timeAgo(data?.createdAt as Date)}
                </span>
              </div>
              <div className="mt-8 flex w-full flex-col gap-2 md:basis-1/3">
                <p className="uppercase text-xs">Method</p>
                <span className="mt-1 text-sm">{data?.method}</span>
              </div>
            </div>

            {/* Response and Request Body  */}
            <div>
              <p className="text-xl font-semibold ml-1 mb-2">Request Body</p>
              <div className="border rounded-lg bg-zinc-900">
                {/* <pre> */}
              <SyntaxHighlighter
                  style={nnfxDark}
                  language="javascript"
                  customStyle={{
                    padding: "25px",
                    fontSize: "15px",
                    color : "white",
                    borderRadius: "16px",
                    backgroundColor: "black",
                  }}
                >
                  {JSON.stringify(data?.requestBody, null, 2)}
                </SyntaxHighlighter>
                {/* </pre> */}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl font-semibold ml-1 mb-2">Response Body</p>
              <div className="border rounded-lg bg-zinc-900">
                <SyntaxHighlighter
                 language="javascript"
                 style={nnfxDark}
                  customStyle={{
                    padding: "25px",
                    fontSize: "15px",
                    color : "white",
                    backgroundColor: "black",
                    borderRadius: "16px",
                  }}
                >
                  {JSON.stringify(data?.responseBody, null, 2)}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
