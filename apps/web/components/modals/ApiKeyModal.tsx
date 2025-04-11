import { useEffect, useState } from "react";

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
  } from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ApiKeyModalProps {
    mode : 'create' | 'edit';
    defaultValue? : { apikeyId: string, name : string , permission : string } | undefined;
    isApiKeyCreateAndUpdateModalOpen : boolean;
    setIsApiKeyCreateAndUpdateModalOpen : (open: boolean) => void;
    onSubmit : (args: { apikeyId? : string, name : string, permission: string }) => void;
}

export const CreateAndUpdateApiKeyModal : React.FC<ApiKeyModalProps> = ({
    mode,
    defaultValue,
    isApiKeyCreateAndUpdateModalOpen, 
    setIsApiKeyCreateAndUpdateModalOpen,
    onSubmit
}) => {
  
const [name, setName] = useState(defaultValue?.name || '');
const [permission, setPermission] = useState (defaultValue?.permission || '');
const handleSubmit = () => {
    if (mode === "create") {
        onSubmit({ name, permission });
    } else if (defaultValue?.apikeyId) {
        onSubmit({ apikeyId: defaultValue.apikeyId, name, permission });
    }
};

useEffect(() => {
    if (defaultValue && mode === "edit") {
        setName(defaultValue.name);
        setPermission(defaultValue.permission);
    } else {
        setName("");
        setPermission("");
    }
},[defaultValue, mode]);
return (
    <Dialog open={isApiKeyCreateAndUpdateModalOpen} onOpenChange={setIsApiKeyCreateAndUpdateModalOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Create' : 'Edit'} API Key</DialogTitle>
            <DialogDescription>
                <Input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="mt-6"
                    type="text"
                    placeholder="Enter name of API"
                />
                <Select
                    value={ permission }
                    onValueChange={(value) => setPermission(value)}
                >
                    <SelectTrigger className="w-full mt-4">
                        <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="FullAccess">Full Access</SelectItem>
                        <SelectItem value="SendingAccess">Sending Access</SelectItem>
                    </SelectContent>
                </Select>
                <Button className="mt-5" onClick={handleSubmit} disabled={mode === 'edit' ? (name === defaultValue?.name && permission === defaultValue?.permission) : (!name || !permission)}>
                    {mode === 'create' ? 'Create' : 'Edit' } key
                </Button>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
    )
}