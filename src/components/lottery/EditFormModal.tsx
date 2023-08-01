import { DatePicker, Form, Input, Modal } from "antd";
import { useContext, useEffect } from "react";
import { context } from "../../App";
import { LotteryConfig } from "./Model";
import LotteryService from "../../services/LotteryService";
import moment from "moment";

interface EditFormModalProps{
    data: LotteryConfig | undefined;
    openForm: boolean;
    reloadList: () => void;
    cancelFormDialog: () => void;
}

export default function EditFormModal(props: EditFormModalProps) {
    const {setLoading} = useContext(context)
    const {data, openForm, cancelFormDialog, reloadList} = props
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        values.start_timestamp = parseFloat(values.start_timestamp.format("X"));
        values.end_timestamp = parseFloat(values.end_timestamp.format("X"));
        values.min = parseFloat(values.min);
        values.max = parseFloat(values.max);
        values.limit = parseFloat(values.limit);
        values.number_of_winners = parseFloat(values.number_of_winners);
        const {key, ...rest} = values;
        const service = new LotteryService;
        await service.saveConfig(rest);
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
           form.setFieldsValue({
                ...data, 
                start_timestamp: moment((data?.start_timestamp ?? 0)*1000),
                end_timestamp: moment((data?.end_timestamp ?? 0)*1000)
            })
        }
    }, [data])

    return (
        <Modal 
           zIndex={0}
           title={data ? "Edit" : "Create"} 
           open={openForm} 
           onOk={() => form.submit()} 
           onCancel={closeForm}
           afterClose={closeForm}
           width={"40%"}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 6 }}
                onFinish={onFinish}
                autoComplete="off"
                >
                <Form.Item
                    label="Channel ID"
                    name="channel_id"
                    rules={[{ required: true, message: 'Channel ID is required!' }]}
                >
                    <Input value={data?.channel_id ?? ""}/>
                </Form.Item>
                <Form.Item
                    label="Min"
                    name="min"
                    rules={[{ required: true, message: 'Min is required!' }]}
                >
                    <Input type="number" value={data?.min ?? ""}/>
                </Form.Item>
                <Form.Item
                    label="Max"
                    name="max"
                    rules={[{ required: true, message: 'Max is required!' }]}
                >
                    <Input type="number" value={data?.max ?? ""}/>
                </Form.Item>
                <Form.Item
                    label="Limit"
                    name="limit"
                    rules={[{ required: true, message: 'Limit is required!' }]}
                >
                    <Input type="number" value={data?.limit ?? ""}/>
                </Form.Item>
                <Form.Item
                    label="Number Of Winners"
                    name="number_of_winners"
                    rules={[{ required: true, message: 'Number Of Winners is required!' }]}
                >
                    <Input type="number" value={data?.number_of_winners ?? ""}/>
                </Form.Item>
                <Form.Item
                    label="Start Date"
                    name="start_timestamp"
                    rules={[{ required: true, message: 'Start Date is required!' }]}
                >
                    <DatePicker showTime placeholder="Start Date"/>
                </Form.Item>
                <Form.Item
                    label="End Date"
                    name="end_timestamp"
                    rules={[{ required: true, message: 'End Date is required!' }]}
                >
                    <DatePicker showTime placeholder="End Date"/>
                </Form.Item>
            </Form>
        </Modal>
   )
}