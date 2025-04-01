"use client";

import { useCallback, useState } from "react";
import {useDebouncedCallback } from "use-debounce";
import EditDetails from "@/components/EditDetails";
import AxiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { EmailSchema } from "@/types/schema";

export default function Page() {
  const [userData, setUserData] = useState({
    name : '',
    email : ''
  });
  const [isEmailUnique, setIsEmailUnique] = useState<boolean>(false);

  // Check the email is available Func. 
  const checkIsEmailUnique = useDebouncedCallback(async (email : string) => {
    //Checking Email is valid 
    const data = EmailSchema.safeParse(userData.email);
    if(!data.success) return;
    try {
      const response = await AxiosInstance.post("/api/emails/check-email-unique",{
          email,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setIsEmailUnique(response.data.status);
      }
    } catch (err : unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Failed to check email availability';
        toast(errorMessage);
      } else if (err instanceof Error) {
        const errorMessage = err.message || 'Failed to check email availability';
        toast(errorMessage);
      }
    }
  },2000);

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
    if (!isEmailUnique && userData.email) return;
    try {
      const response = await AxiosInstance.patch("/api/user/update",
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
      if (response.status === 200) {
        setUserData({
          name: response.data?.name || "",
          email: response.data?.email || "",
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
  },[getBody, isEmailUnique, userData.email]);

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
            checkIsEmailUnique(value);
          }}
          isEmailUnique={isEmailUnique}
        />
      </div>
    </div>
  );
}
