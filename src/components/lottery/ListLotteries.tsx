import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import { LotteryConfig } from "./Model";
import "./Lottery.scss"
import EditFormModal from "./EditFormModal";
import LotteryService from "../../services/LotteryService";
import moment from 'moment';
import NotificationModal from "./NotificationModal";
import { User } from "../../common/Model";

export default function ListLotteryConfigs() {
  const {setLoading} = useContext(context)
  const [lotteryConfigs, setLotteryConfigs] = useState<LotteryConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<LotteryConfig | undefined>();
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [winners, setWinners] = useState<User[]>([]);
  const [spinLoading, setSpinLoading] = useState<boolean>(false);

  const columns: ColumnsType<LotteryConfig> = [
    {
      title: 'Channel ID',
      dataIndex: 'channel_id',
      key: 'channel_id',
    },
    {
      title: 'Channel Name',
      dataIndex: 'channel_name',
      key: 'channel_name',
    },
    {
      title: 'Min',
      dataIndex: 'min',
      key: 'min',
    },
    {
      title: 'Max',
      dataIndex: 'max',
      key: 'max',
    },
    {
      title: 'Limit',
      dataIndex: 'limit',
      key: 'limit',
    },
    {
      title: 'Number Of Winners',
      dataIndex: 'number_of_winners',
      key: 'number_of_winners',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_timestamp',
      key: 'start_timestamp',
      render: (_, lot: LotteryConfig) => (
        <Space size="middle">
           {moment.unix(lot.start_timestamp).format('MMMM Do YYYY, h:mm:ss a')}
        </Space>
      ),
    },
    {
      title: 'End Date',
      dataIndex: 'end_timestamp',
      key: 'end_timestamp',
      render: (_, lot: LotteryConfig) => (
        <Space size="middle">
           {moment.unix(lot.end_timestamp).format('MMMM Do YYYY, h:mm:ss a')}
        </Space>
      ),
    },
    {
      title: 'Spin',
      key: 'spin',
      render: (_, lot: LotteryConfig) => (
        <Space size="middle">
          <Button type="primary" size="middle" loading={spinLoading} onClick={() => {
              if(!spinLoading){
                spinLottery(lot.channel_id)
              }
          }}>
            Spin
          </Button>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, lot: LotteryConfig) => (
        <Space size="middle">
          <a href="#!" onClick={() => openEditFormDialog(lot)}>Edit</a>
          <a href="#!" onClick={() => openConfirmDeleteDialog(lot)}>Delete</a>
        </Space>
      ),
    },
  ];

  const getAllLotteryConfigs = async () => {
    setLoading(true)
    const service = new LotteryService();
    const res = await service.getAllConfigs();
    setLotteryConfigs(res.data.map((d: LotteryConfig) => {
      return {...d, key: d.channel_id};
    }));
    setLoading(false);
  }

  const openEditFormDialog = (lot: LotteryConfig | undefined) => {
     setSelectedConfig(lot);
     setOpenEditForm(true);
  }

  const cancelFormDialog = () => {
    setSelectedConfig(undefined);
    setOpenEditForm(false);
  }

  const openConfirmDeleteDialog = (lot: LotteryConfig) => {
    setSelectedConfig(lot);
    setOpenConfirmDelete(true);
  }

  const cancelConfirmDeleteDialog = () => {
    setSelectedConfig(undefined);
    setOpenConfirmDelete(false);
  }

  const deleteLotteryConfig = async () => {
    setLoading(true);
    setOpenConfirmDelete(false);
    const service = new LotteryService();
    await service.deleteConfig(selectedConfig?.channel_id ?? "");
    setSelectedConfig(undefined);
    getAllLotteryConfigs();
  }

  const spinLottery = async (channelID: string) => {
    setSpinLoading(true);
    const service = new LotteryService();
    const res = await service.spin(channelID)
    setWinners(res.data);
    setOpenNotification(true);
    setSpinLoading(false);
  }

  useEffect(() => {
    getAllLotteryConfigs();
  }, []);

  return (
    <div className="list-lottery-config-screen">
          <Space style={{ marginBottom: 16 }}>
              <Button onClick={() => openEditFormDialog(undefined)}>Create Config</Button>
          </Space>
         <Table columns={columns} dataSource={lotteryConfigs}/>
         <Modal title="Confirm" open={openConfirmDelete} onOk={deleteLotteryConfig} onCancel={cancelConfirmDeleteDialog} zIndex={0}>
            <p>Are you sure you want to delete?</p>
        </Modal>
        <EditFormModal 
           data={selectedConfig} 
           openForm={openEditForm} 
           cancelFormDialog={cancelFormDialog} 
           reloadList={() => getAllLotteryConfigs()}
        />
        <NotificationModal
           data={winners}
           openNotification={openNotification}
           cancelFormDialog={() => {
              setWinners([]);
              setOpenNotification(false);
           }}
        />
    </div>
  );
}