"use client";

import { useCallback, useState } from "react";
import EditDetails from "@/components/EditDetails";
import AxiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/types";

export default function Page() {
  const [userData, setUserData] = useState({
    name : '',
    email : ''
  });
  
  // Return the body for updateHandler Func.
  const getBody = useCallback(() => {
    if(userData.name) {
      return {
        name : userData.name
      };
    }else {
      return {
        email :userData.email
      }
    }
  },[userData.email, userData.name]);


  // Update Email or Name Func.
  const updateHandler = useCallback(async () => {
    const {name , email} = getBody();
    if (!userData.email) return;
    try {
      const response = await AxiosInstance.patch<ApiResponse>("/api/user/update",
        {
          name,
          email
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success === true) {
        setUserData({
          name: response.data?.data.name || "",
          email: response.data?.data.email || "",
        });
        toast(response.data.message);
      }
    } catch (err : unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Failed to update data';
        toast(errorMessage);
      } else if (err instanceof Error) {
        const errorMessage = err.message || 'Failed to update data';
        toast(errorMessage);
      }
    }
  },[getBody, userData.email]);

  return (
    <div className="mx-26 mt-12">
      <div>
        <p className="font-semibold text-2xl">Profile</p>
      </div>

      <div className="mt-12 w-full">
        <EditDetails
          title="Name" 
          type="text"
          placeholder="John Doe"
          handler={updateHandler}
          value={userData.name}
          setterFn={(value) => {
            setUserData((prev) => ({ ...prev, name: value }));
          }}
        />
      </div>
      <div className="mt-12 w-full">
        <EditDetails
          title="Email"
          type="email"
          placeholder="your.email@example.com"
          handler={updateHandler}
          value={userData.email}
          setterFn={(value) => {
            setUserData((prev) => ({ ...prev, email: value }));
          }}
        />
      </div>
    </div>
  );
}
