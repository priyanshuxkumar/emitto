"use client";

import EmailPreview from "@/components/EmailPreview";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { ApiErrorResponse, ApiResponse } from "@/types/types";
import AxiosInstance from "@/utils/axiosInstance";
import { ArrowLeft, Code, Mail } from "lucide-react";
import { ParamValue } from "next/dist/server/request/params";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface EmailProp {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  metadata: JSON;
  userId: number;
  createdAt: Date | string;
}

const useFetchEmail = (id: ParamValue) => {
  const [data, setData] = useState<EmailProp>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get<ApiResponse>(`/api/emails/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success === true) {
        setData(response.data.data);
      }
    } catch (err: unknown) {
      const message = (err as ApiErrorResponse).message || "Something went wrong";
      toast.error("Error", {
        description: message,
      });
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
  const { data, isLoading } = useFetchEmail(id);
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
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Email</p>
                  <h1 className="text-xl font-bold">{data?.to}</h1>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  className="bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-700/50 gap-2 flex-1 md:flex-none"
                >
                  <Code className="w-4 h-4" />
                  API Docs
                </Button>
              </div>
            </div>

            {/* Email Detail */}
            <div className="flex flex-wrap pb-8">
              <div className="mt-8 flex w-full flex-col gap-2 md:basis-1/3">
                <p className="uppercase text-xs">From</p>
                <span className="mt-1 text-sm">{data?.from}</span>
              </div>
              <div className="mt-8 flex w-full flex-col gap-2 md:basis-1/3">
                <p className="uppercase text-xs">Subject</p>
                <span className="mt-1 text-sm text-slate-12">
                  {data?.subject}
                </span>
              </div>
              <div className="mt-8 flex w-full flex-col gap-2 md:basis-1/3">
                <p className="uppercase text-xs">to</p>
                <span className="mt-1 text-sm">{data?.to}</span>
              </div>
            </div>

            {/* Email Preview  */}
            <div className="border p-4 rounded-lg">
            {data?.html ? (
                <EmailPreview htmlContent={data.html} />
            ) : (
                <p>Loading...</p>
            )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
