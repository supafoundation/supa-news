import { Form, Input, Modal } from "antd";
import { useContext, useEffect } from "react";
import { context } from "../../App";
import CategoriesService from "../../services/CategoriesService";
import { Category } from "./Model";

interface FormModalProps{
    data: Category | null;
    openForm: boolean;
    reloadList: () => void;
    cancelFormDialog: () => void;
}

export default function FormModal(props: FormModalProps) {
    const {setLoading} = useContext(context)
    const {data, openForm, cancelFormDialog, reloadList} = props
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        const service = new CategoriesService;
        if(data){
           await service.updateCategory(values);
        }else{
           await service.createCategory(values);
        }
        setLoading(false);
        closeForm();
        reloadList();
      };

    const closeForm = () => {
        cancelFormDialog();
        form.resetFields();
    }

    useEffect(() => {
        if(data){
           form.setFieldsValue(data)
        }
    }, [data])

    return (
        <Modal 
           zIndex={0}
           title={data ? "Edit" : "Create"} 
           visible={openForm} 
           onOk={() => form.submit()} 
           onCancel={closeForm}
           afterClose={closeForm}
           width={"40%"}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 4 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                >
                <Form.Item name="id" noStyle>
                   <Input type="hidden"/>
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Name is required!' }]}
                >
                    <Input value={data?.name ?? ""}/>
                </Form.Item>
            </Form>
        </Modal>
   )
}