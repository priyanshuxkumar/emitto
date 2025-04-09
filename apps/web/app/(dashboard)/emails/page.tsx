'use client';

import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import AxiosInstance from "@/utils/axiosInstance";
import { timeAgo } from "@/helper/time";
import { ApiErrorResponse, ApiResponse } from "@/types/types";
import { toast } from "sonner";

interface EmailProp {
  id : string;
  to : string[];
  status : string;
  subject : string;
  sentTime : Date | string;
}

const useFetchEmails = () => {
  const [data, setData] = useState<EmailProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.get<ApiResponse>(`/api/emails`, {
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
    };

    fetchData();
  }, []);

  return {
    data,
    isLoading,
  };
}

export default function Page() {
  const { data , isLoading } = useFetchEmails();
  return (
    <div className="flex items-center justify-between mx-26 mt-12">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="font-semibold text-2xl">Emails</p>
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

        {/* Body  */}
        <div className="mt-12">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex justify-center items-center py-4">
                      <Loader color="white" strokeWidth="2" size="30" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item: EmailProp) => (
                  <TableRow key={item.id} className="text-base">
                    <TableCell className="underline decoration-dashed text-ellipsis pr-8 py-4">
                      <Link href={`/emails/${item.id}`}>{item.to}</Link>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="bg-secondary/80 px-2 py-1 rounded-sm text-sm">
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 truncate">{item.subject}</TableCell>
                    <TableCell className="text-right py-4">{timeAgo(item.sentTime as Date)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
