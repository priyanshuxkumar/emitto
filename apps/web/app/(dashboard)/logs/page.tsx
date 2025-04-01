"use client";

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
import clsx from "clsx";

export interface ApiKeyLogProps {
  id: string;
  method: string;
  endpoint: string;
  responseStatus: number;
  createdAt: Date | string;
}


const useFetchApiKeyLogs = () => {
  const [data, setData] = useState<ApiKeyLogProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.get(`/api/apikey/logs`, {
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
    };

    fetchData();

    fetchData();
  }, []);

  return {
    data,
    isLoading,
  };
};

export default function Page() {
  const {data, isLoading} = useFetchApiKeyLogs();
  console.log(data);
  return (
    <div className="flex items-center justify-between mx-26 mt-12">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="font-semibold text-2xl">Logs</p>
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
                <TableHead className="w-[100px]">Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Creation Date</TableHead>
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
                data.map((item: ApiKeyLogProps) => (
                  <TableRow key={item.id} className="text-base">
                    <TableCell className="underline decoration-dashed text-ellipsis pr-8 py-4">
                      <Link href={`/logs/${item.id}`}>{item.endpoint}</Link>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={clsx("px-2 py-1 rounded-sm text-sm", item.responseStatus == 200 ? "bg-green-800" : "bg-yellow-500")}>
                        {item.responseStatus}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 truncate">
                      {item.method}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      {timeAgo(item.createdAt as Date)}
                    </TableCell>
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
