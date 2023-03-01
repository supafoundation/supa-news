import { Form, Input, Modal } from "antd";
import { useContext } from "react";
import { context } from "../../App";
import SupaChargeService from "../../services/SupaChargeService";

interface FormModalProps{
    openForm: boolean;
    cancel: () => void,
    reloadList: () => void;
}

export default function FormModal(props: FormModalProps) {
    const {setLoading} = useContext(context)
    const {openForm, cancel, reloadList} = props
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        values = {...values, amount: parseFloat(values.amount)};
        const service = new SupaChargeService();
        await service.addCells(values);
        reloadList();
        closeForm();
      };

    const closeForm = () => {
        cancel();
        form.resetFields();
    }

    return (
        <Modal 
           zIndex={0}
           title={"Add Cells"} 
           open={openForm} 
           onOk={() => form.submit()} 
           onCancel={closeForm}
           afterClose={closeForm}
           width={"40%"}
        >
            <Form
                form={form}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                labelCol={{ span: 6 }}
                style={{ maxWidth: 600 }}
                >
                <Form.Item
                    label="Wallet Adddress"
                    name="wallet_address"
                    rules={[{ required: true, message: 'Wallet adddress is required' }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Amount is required' }]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
   )
}