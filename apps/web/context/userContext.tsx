'use client'

import { ApiErrorResponse, ApiResponse } from "@/types/types";
import AxiosInstance from "@/utils/axiosInstance";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
    id : string;
    email : string;
    userMetadata : {
        name : string;
        avatarUrl : string;
        email : string;
        emailVerified : boolean;
    }
}

interface UserContextType {
    user : User | null
    isAuthenticated : boolean
}

interface UserProviderProps {
    children : ReactNode;
}


const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error('useUser must be used with in a UserProvider');
    }
    return context;
}

export const UserProvider : React.FC<UserProviderProps> = ({children}) => {
    const [user , setUser] = useState<User | null>(null);
    const [isAuthenticated , setIsAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        (async() => {
            try {
                const response = await AxiosInstance.get<ApiResponse>(`/api/user`, {
                    withCredentials: true,
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                });
                if(response.data.success == true){
                   setUser(response.data.data);
                   setIsAuthenticated(true);
                }
            } catch (err) {
                const message = (err as ApiErrorResponse).message || "Something went wrong";
                toast.error("Failed to fetch data", {
                  description: message,
                });
            }
        })()
    },[]);
    return (
        <UserContext.Provider value={{user, isAuthenticated}}>
            {children}
        </UserContext.Provider>
    )
}