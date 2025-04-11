'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ApiErrorResponse, ApiResponse } from "@/types/types";
import AxiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { toast } from "sonner";

export default function Feedback() {
  const [comment, setComment] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const handleFeedbackSubmit = async() => {
    try {
        const response = await AxiosInstance.post<ApiResponse>('/api/feedback/submit', {
            comment
        }, {
            withCredentials : true,
            headers : {
                'Content-Type' : 'application/json'
            }
        });
        if(response.data.success === true) {
            console.log(response.data);
            toast(response.data.message);
            setOpen(prevOpen => !prevOpen);
        }
    } catch (err) {
      const message = (err as ApiErrorResponse).message || "Something went wrong";
      console.error(err)
        toast.error("Error", {
          description: message,
        });
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Feedback</Button>
      </DialogTrigger>
      <DialogDescription></DialogDescription>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="h-30">
            <Textarea
                onChange={(e) => setComment(e.target.value)}
                placeholder="Help us to improve this platform"
                className="resize-none h-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleFeedbackSubmit}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
