'use client'
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "@/components/Loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Ellipsis, Eye, Pencil, Trash2} from "lucide-react";
import { toast } from "sonner";
import { timeAgo } from "@/helper/time";
import { ApiErrorResponse, ApiResponse } from "@/types/types";
import { CreateAndUpdateApiKeyModal } from "@/components/modals/ApiKeyModal";

interface ApiDataProp {
    id : string;
    name : string;
    shortToken : string;
    lastUsed : Date;
    permission : 'FullAccess' | 'SendingAccess'
    createdAt : Date;
}

/**
 * Custom React hook to fetch API keys of logged-in user.
 * @returns {ApiDataProp[]} return.data - The list of fetched API keys.
 * @returns {Function} return.setData - Function to manually update the data state.
 * @returns {boolean} return.isLoading - Indicates whether the data is currently being fetched.
 */
const useFetchApiKeys = () => {
  const [data, setData] = useState<ApiDataProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosInstance.get<ApiResponse>('/api/apikey', {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
        if(response.data.success === true) {
          setData(response.data.data);
        }
      } catch (err : unknown) {
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

  return { data: data || [], setData, isLoading };
};

export default function Page() {
  const { data, setData, isLoading } = useFetchApiKeys();

  // Copy API Key 
  const apiKeyRef = useRef<HTMLInputElement | null>(null);
  const [apiKey , setApiKey] = useState<string>('');
  
  /** State for modal of API Key Visibility */
  const [apiKeyViewDialogOpen, setApiKeyViewDialogOpen] = useState(false);
  
  // State for API key visible / hidden
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
 
  // State for check Modal state (Open / Closed)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // State for modal is open for which task Create API Key or Edit
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Default values passed on Modal 
  const [modalDefaultValue, setModalDefaultValue] = useState<{ apikeyId: string; name: string; permission: string } | undefined>();

  // Handler for open Edit API Key Modal
  const openEditModal = (apikeyId : string, name : string , permission: string) => {
    setModalMode('edit');
    setIsModalOpen(!isModalOpen);
    setModalDefaultValue({apikeyId, name , permission});
  }

  // Handler for open create API Key Modal
  const openCreateModal = () => {
    setModalMode('create');
    setIsModalOpen(!isModalOpen);
  }

  /** Function for create the API Key */
  const handleCreateApiKey = async(name : string, permission: string) => {
    try {
      const response = await AxiosInstance.post<ApiResponse>("/api/apikey/create", {
        name,
        permission
      }, {
        withCredentials : true
      });
      if(response.data.success == true){
        const { apiKey, ...newApiKey } = response.data.data;

        //Append new API key with previous keys
        setData(prev => [newApiKey , ...prev]);

        //Set new generated API Key for showing user (one time)
        setApiKey(apiKey);

        //Showing the Card of new API Key to user 
        setApiKeyViewDialogOpen(!apiKeyViewDialogOpen);
      }
    } catch (err) {
      const message = (err as ApiErrorResponse).message || "Something went wrong";
      toast.error("Error", {
        description: message,
      });
    }
  };

  /** Function for delete API Key */
  const handleDeleteApiKey = async(apiKeyId : string) => {
    try {
      const response = await AxiosInstance.delete<ApiResponse>(`/api/apikey/${apiKeyId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      if(response.data.success == true) {
        setData(data.filter(item => item.id != apiKeyId));
      }
    } catch (err) {
      const message = (err as ApiErrorResponse).message || "Something went wrong";
      toast.error("Error", {
        description: message,
      });
    }
  }

  /** Function for edit the existing API Key */
  const handleEditApiKey = async(apiKeyId : string, name: string, permission: string) => {
    try {
      const response = await AxiosInstance.patch<ApiResponse>(`/api/apikey/${apiKeyId}`, {
        name,
        permission
      },{
        withCredentials : true
      });
      if(response.data.success == true) {
        toast.success("Success", {
          description : response.data.message
        });
        const updatedName = response.data.data.name;
        const updatedPermission = response.data.data.permission; 
        setData((prev) => prev.map(item => item.id === apiKeyId ? {...item , name : updatedName, permission : updatedPermission} : item))
      }
    } catch (err) {
      const message = (err as ApiErrorResponse).message || "Something went wrong";
      toast.error("Error", {
        description: message,
      });
    }
  }

  /**
   * Function for copy the created API Key
   */
  const handleCopyApiKey = useCallback(() => {
    apiKeyRef.current?.select();
    apiKeyRef.current?.setSelectionRange(0, apiKey.length)
    window.navigator.clipboard.writeText(apiKey);

    toast.success("Success", {
      description : "Copied"
    });
  },[apiKey]);

  /**
   * Handles submission of the API Key form based on the current modal mode—either creating or updating.
   * @param {Object} args - The input arguments for the API key.
   * @param {string} [args.apikeyId] - The ID of the API key to edit (optional, used in edit mode).
   * @param {string} args.name - The name of the API key.
   * @param {string} args.permission - The permission assigned to the API key.
   */
  const handleSubmit = (args: { apikeyId?: string; name: string; permission: string }) => {
    if (modalMode === 'edit' && args.apikeyId) {
      handleEditApiKey(args.apikeyId, args.name, args.permission);
    } else {
      handleCreateApiKey(args?.name, args.permission);
    }
    setIsModalOpen(false);
  }
  return (
    <>
      <div className="flex items-center justify-between mx-26 mt-12">
        <div>
          <p className="font-semibold text-2xl">API keys</p>
        </div>
        <div>
          {/* Create API Key Button : its open the modal  */}
          <Button onClick={openCreateModal} variant="secondary">Create API Key</Button>

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
            ) : (
              /** Rendering all api-keys */
              data.map((item: ApiDataProp) => (  
                <TableRow key={item.id} className="text-base">
                  <TableCell className="font-semibold underline decoration-dashed text-ellipsis pr-8 py-4">
                    <Link href={`/apikeys/${item.id}`}>{item.name}</Link>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="bg-secondary/80 p-1 rounded-sm text-sm">
                      {item.shortToken}....
                    </span>
                  </TableCell>
                  <TableCell className="py-4">Full access</TableCell>
                  <TableCell className="text-right py-4">
                    {timeAgo(item?.lastUsed as Date) ?? "Never"}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    {new Date(item?.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    {/** Popover dialog box for options of api-key */}
                    <Popover>  
                      <PopoverTrigger asChild>
                        <Button variant="ghost">
                          <Ellipsis />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-55 space-y-2">
                        <div>
                          {/* Update API Key Button : its open the modal  */}
                          <Button 
                            onClick={() => openEditModal(item.id, item.name, item.permission)}
                            variant={"ghost"}
                            className="w-full justify-start text-base"
                          >
                            <Pencil className="w-3" />
                            Edit
                          </Button>
                        </div>
                        <div>
                          <Button
                            onClick={() => handleDeleteApiKey(item.id)}
                            variant={"ghost"}
                            className="w-full text-red-500 justify-start text-base hover:text-red-500"
                          >
                            <Trash2/>
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
        
      { /** Render Modal for create and edit API Key */
        isModalOpen && 
          <CreateAndUpdateApiKeyModal
            mode={modalMode}
            defaultValue={modalDefaultValue}
            isApiKeyCreateAndUpdateModalOpen={isModalOpen}
            setIsApiKeyCreateAndUpdateModalOpen={setIsModalOpen}
            onSubmit={handleSubmit}
          />
      }
    </>
  );
}