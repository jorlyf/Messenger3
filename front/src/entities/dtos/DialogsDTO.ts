import PrivateDialogDTO from "./PrivateDialogDTO";
import GroupDialogDTO from "./GroupDialogDTO";

export default interface DialogsDTO {
		privateDialogDTOs: PrivateDialogDTO[];
		groupDialogDTOs: GroupDialogDTO[];
}