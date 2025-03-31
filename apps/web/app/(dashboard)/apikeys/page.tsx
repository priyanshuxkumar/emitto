'use client'

import Loader from "@/components/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AxiosInstance from "@/utils/axiosInstance";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Eye} from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import ErrorPage from "@/components/Error";
import Link from "next/link";
import { timeAgo } from "@/helper/time";

interface ApiDataProp {
    id : string;
    name : string;
    shortToken : string;
    lastUsed : Date;
    createdAt : Date;
}

const useFetchApiKeys = () => {
  const [data, setData] = useState<ApiDataProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | unknown>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.get('/api/apikey', {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
        setData(response.data);
      } catch (err : unknown) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data: data || [], setData, isLoading, error,  };
};

export default function Page() {
  const { data, setData, isLoading, error } = useFetchApiKeys();

  // Copy API Key 
  const apiKeyRef = useRef<HTMLInputElement | null>(null);
  const [apiKey , setApiKey] = useState<string>('');
  
  //Create API Key formdata
  const [formData, setFormData] = useState({
    name : "",
    permission : "",
  });

  /** State for modal of Create API Key */
  const [apiDialogOpen, setApiDialogOpen] = useState(false)

  /** State for modal of API Key Visibility */
  const [apiKeyViewDialogOpen, setApiKeyViewDialogOpen] = useState(false);
  
  // State for API key visible / hidden
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const createApiKey = async() => {
    try {
      const response = await AxiosInstance.post("/api/apikey/create", {
        name : formData.name
      }, {
        withCredentials : true
      });
      if(response.status == 201){
        //Append new API key with previous keys
        setData(prev => [response.data.apiKeyMetadata , ...prev]);

        //Set new generated API Key for showing user (one time)
        setApiKey(response.data.apiKey);

        //Close the Dialog of Create API Key
        setApiDialogOpen(false);

        //Showing the Card of new API Key to user 
        setApiKeyViewDialogOpen(!apiKeyViewDialogOpen);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'API Key Creation failed';

        toast.error('API Key not created', {
          description: errorMessage
        });
      } else {
        toast.error('Unexpected Error', {
          description: 'An unexpected error occurred'
        });
      }
    }
  };

  const handleCopyApiKey = useCallback(() => {
    apiKeyRef.current?.select();
    apiKeyRef.current?.setSelectionRange(0,apiKey.length)
    window.navigator.clipboard.writeText(apiKey);
  },[apiKey]);

  return (
    <>
      <div className="flex items-center justify-between mx-26 mt-12">
        <div>
          <p className="font-semibold text-2xl">API keys</p>
        </div>
        <div>
          {/* Create API Key Modal  */}
          <Dialog open={apiDialogOpen} onOpenChange={setApiDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">Create API Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>
                  <Input
                    onChange={(e) =>setFormData({ ...formData, name: e.target.value })}
                    name="name"
                    className="mt-6"
                    type="text"
                    placeholder="Enter name of API"
                  />
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, permission: value })
                    }
                  >
                    <SelectTrigger className="w-full mt-4">
                      <SelectValue placeholder="Full Access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullAccess">Full Access</SelectItem>
                      <SelectItem value="sendingAccess">
                        Sending Access
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="mt-5" onClick={createApiKey}>
                    Create Key
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* API Key view Modal  */}
          {apiKeyViewDialogOpen && (
            <div className="fixed top-0 left-0 flex justify-center items-center h-screen w-screen backdrop-blur-xs z-10">
              <Card className="w-1/3">
                <CardHeader>
                  <CardTitle className="text-2xl">View API Key</CardTitle>
                  <CardDescription className="text-base text-red-500 font-medium mt-2 border px-2 py-2 rounded-lg">
                    Api key created successfully. This key will not be shown
                    again. Save it securely!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <div>Name</div>
                      <Label htmlFor="apikey">
                        <Input
                          ref={apiKeyRef}
                          readOnly
                          id="apikey"
                          value={apiKey}
                          type={isApiKeyVisible ? "text" : "password"}
                        />
                        <Eye
                          onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                        />
                        <Copy onClick={handleCopyApiKey} />
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => setApiKeyViewDialogOpen(false)}>
                    Done
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="mx-26 mt-12">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>API key</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead className="text-right">Last Used</TableHead>
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
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <ErrorPage errorMessage={error}/>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item: ApiDataProp) => (
                <TableRow key={item.id} className="text-base">
                  <TableCell className="font-semibold underline decoration-dashed text-ellipsis pr-8 py-4"><Link href={`/apikeys/${item.id}`}>{item.name}</Link></TableCell>
                  <TableCell className="py-4">
                    <span className="bg-secondary/80 p-1 rounded-sm text-sm">{item.shortToken}....</span>
                  </TableCell>
                  <TableCell className="py-4">Full access</TableCell>
                  <TableCell className="text-right py-4">
                    {timeAgo(item?.lastUsed as Date) ?? "Never" }
                  </TableCell>
                  <TableCell className="text-right py-4">
                    {new Date(item?.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}