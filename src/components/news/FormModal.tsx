import { Form, Input, Modal, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useContext, useEffect } from "react";
import { context } from "../../App";
import NewsService from "../../services/NewsService";
import { Category, Item } from "./Model";

interface FormModalProps {
    categories: Category[];
    selectedCategory: string;
    data: Item | null | undefined;
    openForm: boolean;
    cancelFormDialog: () => void;
    reloadList: (cat: string) => void;
    setSelectedCategory: (cat: string) => void;
}

export default function FormModal(props: FormModalProps) {
    const {setLoading} = useContext(context)
   const {categories, selectedCategory, data, openForm, cancelFormDialog, reloadList, setSelectedCategory} = props
   const [form] = Form.useForm();

   const onFinish = async (values: any) => {
     setLoading(true)
     const {category_id, key, ...data} = values
     const service = new NewsService()
     if(key){
        await service.updateItem({
            category_id,
            key,
            item: data
        })
     }else{
        await service.createItem({
            category_id,
            item: data
        })
     }
     closeForm()
     setSelectedCategory(category_id)
     reloadList(category_id)
   };

   const closeForm = () => {
    cancelFormDialog()
    form.resetFields()
    form.setFieldsValue({...data, category_id: selectedCategory})
   }

   useEffect(() => {
       if(data){
         form.setFieldsValue({...data, category_id: selectedCategory})
       }else{
         form.setFieldsValue({category_id: categories.length > 0 ? categories[0].id : ""})
       }
   }, [data])

   return (
        <Modal 
           zIndex={0}
           style={{ top: 20 }}
           title={data?.key ? "Edit" : "Create"} 
           visible={openForm} 
           onOk={() => form.submit()} 
           onCancel={closeForm}
           afterClose={closeForm}
           width={"60%"}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 4 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                >
                <Form.Item name="key" noStyle>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="category_id"
                >
                    <Select value={categories.length > 0 ? categories[0].id : ""} style={{ width: 200 }}>
                        {categories.map((cat: any) => <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Title is required!' }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Short Description"
                    name="short_description"
                    rules={[{ required: true, message: 'Short Description required' }]}
                >
                    <TextArea rows={3}/>
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <TextArea rows={10}/>
                </Form.Item>
                <Form.Item
                    label="Image URL"
                    name="image_url"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Video URL"
                    name="video_url"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="External URL"
                    name="external_url"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Collection Name"
                    name="collection_name"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Contract Address"
                    name="contract_address"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Token ID"
                    name="token_id"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Project Creator"
                    name="project_creator"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Influencer ID"
                    name="influencer_id"
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
   )
}