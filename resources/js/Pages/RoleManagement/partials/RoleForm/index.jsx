import React from "react";
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogCloseTrigger,
} from "@/Components/themes/ui/dialog";
import RoleFormFields from "./RoleFormFields";

export default function RoleForm({ isOpen, onClose, role = null }) {
    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) onClose();
            }}
            size="xl"
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {role ? "Edit Role" : "Add New Role"}
                    </DialogTitle>
                </DialogHeader>
                <DialogCloseTrigger />
                <DialogBody>
                    <RoleFormFields role={role} onClose={onClose} />
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    );
}
