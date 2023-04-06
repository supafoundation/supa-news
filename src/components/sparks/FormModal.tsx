import { AutoComplete, Form, Input, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import SupaChargeService from "../../services/SupaChargeService";
import { Pagination, User } from "../../common/Model";
import UserService from "../../services/UserService";

interface FormModalProps{
    openForm: boolean;
    cancel: () => void,
    reloadList: () => void;
}

export default function FormModal(props: FormModalProps) {
    const {setLoading} = useContext(context)
    const {openForm, cancel, reloadList} = props
    const [pagination] = useState<Pagination>({pageIndex: 1, pageSize: 100000, totalRecords: 0});
    const [users, setUsers] = useState<User[]>([]);
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        const user = users.find(user => user.nick_name === values.nick_name);
        const data = {wallet_address: user?.wallet_address, amount: parseFloat(values.amount)};
        const service = new SupaChargeService();
        await service.addSparks(data);
        reloadList();
        closeForm();
    };

    const closeForm = () => {
        cancel();
        form.resetFields();
    }

    const getAllUsers = async () => {
        const service = new UserService();
        const res = await service.searchUsers({
            keyword: "",
            page_index: pagination.pageIndex,
            page_size: pagination.pageSize,
          });
        setUsers(res.data.users ?? []);
    }

    const filterUsers = (keyword: string, option: any): boolean => {
        const user = users.find(user => user.nick_name === option.value);
        if(user){
            return (user.nick_name.toUpperCase().indexOf(keyword.toUpperCase()) !== -1) || (user.wallet_address === keyword.trim());
        }else{
            return false;
        }
    }

    useEffect(() => {
        getAllUsers();
    }, [])

    return (
        <Modal 
           zIndex={0}
           title={"Add Spacks"} 
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
                    label="Select User"
                    name="nick_name"
                    rules={[{ required: true, message: 'User is required' }]}
                >
                    <AutoComplete
                        allowClear
                        notFoundContent="No Data"
                        options={users.map(user => ({label: user.nick_name, value: user.nick_name}))}
                        filterOption={filterUsers}
                        onBlur={() => {
                            const nickName = form.getFieldValue("nick_name");
                            if(!users.find(user => user.nick_name === nickName)){
                                form.setFieldsValue({nick_name: ""});
                            }
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Amount is required' }]}
                >
                    <Input type="number"/>
                </Form.Item>
            </Form>
        </Modal>
   )
}