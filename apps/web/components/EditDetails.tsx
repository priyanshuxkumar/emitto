import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditDetailsProps {
  title: string;
  type?: "text" | "email";
  placeholder?: string;
  value: string;
  handler: () => void;
  setterFn: (value: string) => void;
}

export default function EditDetails({
  title,
  type = "text",
  placeholder = "",
  value,
  handler,
  setterFn,
}: EditDetailsProps) {
  return (
    <Card className="w-full  border-zinc-800 bg-black text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Your {title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={title.toLowerCase()} className="text-zinc-300">
            {title}
          </Label>
          <div className="relative">
            <Input
              id={title.toLowerCase()}
              onChange={(e) => setterFn(e.target.value)}
              type={type}
              value={value}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700"
              placeholder={placeholder}
            />
            {type === "email" && value.length > 0 && (
              <div className="flex justify-start items-center">
                <p className="text-red-500 text-sm">Email is already taken</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handler}
          disabled={(type == "email" && !value) || (type == "text" && !value)}
          className="w-auto bg-white text-black hover:bg-zinc-200 transition-colors"
        >
          Update {title}
        </Button>
      </CardFooter>
    </Card>
  );
}


