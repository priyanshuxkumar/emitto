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
import AxiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function Feedback() {
  const [comment, setComment] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const handleFeedbackSubmit = async() => {
    try {
        const response = await AxiosInstance.post('/api/feedback/submit', {
            comment
        }, {
            withCredentials : true,
            headers : {
                'Content-Type' : 'application/json'
            }
        });
        if(response.status == 201) {
            toast(response.data.message);
            setOpen(prevOpen => !prevOpen);
            setComment('');
        }
    } catch (err : unknown) {
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
