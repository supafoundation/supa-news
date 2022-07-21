import { Modal } from "antd";

interface FormModalProps {
    submitForm: () => void;
    cancelFormDialog: () => void;
}

export default function FormModal(props: FormModalProps) {
   const {submitForm, cancelFormDialog} = props

   return (
        <Modal title="Edit Form" visible={true} onOk={() => submitForm()} onCancel={cancelFormDialog}>
            <p>Edit</p>
        </Modal>
   )
}