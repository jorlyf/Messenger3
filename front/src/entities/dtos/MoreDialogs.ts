import { DialogTypes } from "../local/Dialog";
import DialogsDTO from "./chat/DialogsDTO";


export interface MoreDialogsRequest {
  existingDialogs: Dialog[];
}
export interface MoreDialogsAnswer {
  dialogsDTO: DialogsDTO;
  totalDialogCount: number;
}
interface Dialog {
  id: number;
  type: DialogTypes;
}