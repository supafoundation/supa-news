import { List, Modal, Typography } from "antd";
import { User } from "../../common/Model";

interface NotificationModalProps{
    data: User[];
    openNotification: boolean;
    cancelFormDialog: () => void;
}

export default function NotificationModal(props: NotificationModalProps) {
    const {data, openNotification, cancelFormDialog} = props

    const closeForm = () => {
        cancelFormDialog();
    }

    return (
        <Modal 
           zIndex={0}
           title={"Notification"} 
           open={openNotification} 
           onCancel={closeForm}
           afterClose={closeForm}
           width={"40%"}
           footer={null}
        >
            {data.length === 0 && <p>Something went wrong. There is no winner here!</p>}
            {data.length > 0 && <List
                    header={<h4>List Of Winners</h4>}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item key={item.nick_name}>
                            <Typography.Text>{item.nick_name}</Typography.Text>
                        </List.Item>
                    )}
                />
            }
        </Modal>
   )
}