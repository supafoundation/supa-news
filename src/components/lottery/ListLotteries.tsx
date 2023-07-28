import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import { LotteryConfig } from "./Model";
import "./Lottery.scss"
import FormModal from "./FormModal";
import LotteryService from "../../services/LotteryService";
import moment from 'moment';

export default function ListLotteryConfigs() {
  const {setLoading} = useContext(context)
  const [lotteryConfigs, setLotteryConfigs] = useState<LotteryConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<LotteryConfig | undefined>();
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);

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
      title: 'Action',
      key: 'action',
      render: (_, lot: LotteryConfig) => (
        <Space size="middle">
          <a href="#!" onClick={() => openFormDialog(lot)}>Edit</a>
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

  const openFormDialog = (lot: LotteryConfig | undefined) => {
     setSelectedConfig(lot);
     setOpenForm(true);
  }

  const cancelFormDialog = () => {
    setSelectedConfig(undefined);
    setOpenForm(false);
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

  useEffect(() => {
    getAllLotteryConfigs();
  }, []);

  return (
    <div className="list-lottery-config-screen">
          <Space style={{ marginBottom: 16 }}>
              <Button onClick={() => openFormDialog(undefined)}>Create Config</Button>
          </Space>
         <Table columns={columns} dataSource={lotteryConfigs}/>
         <Modal title="Confirm" open={openConfirmDelete} onOk={deleteLotteryConfig} onCancel={cancelConfirmDeleteDialog} zIndex={0}>
            <p>Are you sure you want to delete?</p>
        </Modal>
        <FormModal 
           data={selectedConfig} 
           openForm={openForm} 
           cancelFormDialog={cancelFormDialog} 
           reloadList={() => getAllLotteryConfigs()}
           />
    </div>
  );
}