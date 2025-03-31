"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Code,
  MoreHorizontal,
  Shield,
  Globe,
  Clock,
  Calendar,
  Key,
  AlertTriangle,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import AxiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { ParamValue } from "next/dist/server/request/params";
import Loader from "@/components/Loader";
import { timeAgo } from "@/helper/time";

interface APIKeyDetails {
  id: string;
  name: string;
  permission: string;
  shortToken: string;
  status: boolean;
  totalUses: number;
  userId: number;
  creatorEmail: string;
  lastUsed: Date | string;
  createdAt: Date | string;
}

const useFetchApiKeyDetails = (id: ParamValue) => {
  const [data, setData] = useState<APIKeyDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.get(`/api/apikey/${id}`, {
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
  }, [id]);

  return {
    data,
    isLoading,
  };
};

export default function ApiKeyPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useUser();
  const { data, isLoading } = useFetchApiKeyDetails(id);
  
  return (
    <div className="scrollContainer h-[calc(100vh-60px)] overflow-auto text-white pb-10">
      {isLoading ? (
        <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
          <Loader color="white" strokeWidth="2" size="30" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 py-8">
            <div className="flex items-center gap-4">
              <div className="mr-3 cursor-pointer" onClick={() => router.back()}><ArrowLeft/></div>
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-900/20">
                <Key className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{data?.name}</h1>
                  <Badge
                    variant="outline"
                    className="bg-emerald-950/50 text-emerald-400 border-emerald-800 px-2 py-0 h-5 text-xs"
                  >
                    {data?.status ? "Active" : "Not Active"}
                  </Badge>
                </div>
                <p className="text-zinc-400 text-sm">API Key</p>
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700/50"
                  >
                    <MoreHorizontal className="w-4 h-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-zinc-800 border-zinc-700 text-white"
                >
                  <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer flex items-center gap-2">
                    <Pencil className="w-4 h-4" /> Edit Key
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-700" />
                  <DropdownMenuItem className="text-red-400 hover:bg-red-950/50 hover:text-red-300 cursor-pointer flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Revoke Key
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Token Card */}
          <Card className="mb-6 overflow-hidden py-0 bg-black">
            <div className="px-6 py-4 border-b">
              <h2 className="font-medium flex items-center gap-2">
                <Key className="w-4 h-4 text-violet-400" /> Token Information
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs mb uppercase tracking-wider">
                    TOKEN
                  </p>
                  <div className="rounded-md py-2.5 text-sm font-mono flex items-center justify-between group">
                    <span>{data?.shortToken}....</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider">
                    Creation Time
                  </p>
                  <div className="flex items-center gap-2 py-2.5">
                    <Calendar className="w-4 h-4 text-zinc-500" />
                    <time className="text-sm text-current" dateTime={data?.createdAt as string}>{new Date(data?.createdAt as Date).toLocaleDateString()}</time>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="mb-6 py-0 bg-black">
            <div className="px-6 py-4 border-b">
              <h2 className="font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" /> Permissions &
                Usage
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
                    PERMISSION
                  </p>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <p>{data?.permission} access</p>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
                    DOMAIN
                  </p>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <p>All domains</p>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
                    TOTAL USES
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-zinc-900/80 text-zinc-300 border-zinc-700 px-2 py-0 h-5"
                    >
                      {data?.totalUses} times
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
                    LAST USED
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    <time dateTime={data?.lastUsed as string}>
                      {timeAgo(data?.lastUsed as Date) ?? "Never" }
                    </time>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-zinc-400 text-xs mb-1.5 uppercase tracking-wider">
                    CREATOR
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={user?.userMetadata.avatarUrl} />
                      <AvatarFallback className="uppercase text-white text-xl font-semibold">
                        {user?.userMetadata.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p>{data?.creatorEmail}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
