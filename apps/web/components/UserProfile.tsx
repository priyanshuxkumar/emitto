import { Ellipsis, LogOutIcon, User } from "lucide-react";
import { useUser } from "@/context/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import AxiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import Loader from "./Loader";
import { ApiErrorResponse, ApiResponse } from "@/types/types";

export default function UserProfile() {
  //Logged-in User Details
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await AxiosInstance.post<ApiResponse>("/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.success === true) {
        router.push('/signin')
        toast(response.data.message);
      }
    } catch (err) {
      const message = (err as ApiErrorResponse).message || "Something went wrong";
      toast.error("Logout failed", {
        description: message,
      });
    }
  };
  return (
    <>
      {!user ? (
        <div className="flex justify-center items-center w-full">
            <Loader color="white" strokeWidth="2" size="30" />
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div>
              <Avatar>
                <AvatarImage src={user?.userMetadata.avatarUrl} />
                <AvatarFallback className="uppercase text-white text-xl font-semibold">
                  {user?.userMetadata.name[0]
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <span className="lowercase">{user?.userMetadata.name}</span>
            </div>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  <Ellipsis />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-55 space-y-2">
                <div>
                  <Button
                    onClick={() => router.push("/profile")}
                    variant={"ghost"}
                    className="w-full justify-start text-base"
                  >
                    <User />
                    Profile
                  </Button>
                </div>
                <div>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-base"
                    onClick={handleLogout}
                  >
                    <LogOutIcon />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </>
  );
}
