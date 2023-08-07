import { Button, DatePicker, Input, Select, Space, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import { TransactionLog } from "./Model";
import { Pagination } from "../../common/Model";
import moment from 'moment';
import { DatePickerProps, RangePickerProps } from "antd/lib/date-picker";
import SupaChargeService from "../../services/SupaChargeService";

export default function ListTransLogs() {
  const {setLoading} = useContext(context)
  const [keyword, setKeyword] = useState<string>("")
  const [logs, setLogs] = useState<TransactionLog[]>([])
  const [pagination, setPagination] = useState<Pagination>({pageIndex: 1, pageSize: 10, totalRecords: 0});
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [status, setStatus] = useState<number>(0)
  
  const columns: ColumnsType<TransactionLog> = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (_, log: TransactionLog) => (
        <Space size="middle">
           {moment(log.timestamp).format('MMMM Do YYYY, h:mm:ss a')}
        </Space>
      ),
    },
    {
      title: 'Receipt ID',
      dataIndex: 'receipt_id',
      key: 'receipt_id',
      render: (_, log: TransactionLog) => (
        <Space size="middle">
           {log.receipt_id}
        </Space>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (_, log: TransactionLog) => (
        <Space size="middle">
           {log.user_id}
        </Space>
      ),
    },
    {
      title: 'Nick Name',
      dataIndex: 'nick_name',
      key: 'nick_name',
      render: (_, log: TransactionLog) => (
        <Space size="middle">
           {log.nick_name}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, log: TransactionLog) => (
        <Space size="middle">
           {log.status ? "Success": "Fail"}
        </Space>
      ),
    }
  ];
  
  const searchTransactionLog = async () => {
    setLoading(true)
    const service = new SupaChargeService();
    const res = await service.searchTransLogs(keyword, status, fromDate, toDate, pagination.pageIndex, pagination.pageSize);
    setLogs(res.data.records ?? [])
    setPagination({...pagination, totalRecords: res.data.total});
    setLoading(false);
  }

  const onChangeFromDate = (
    _value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: string,
  ) => {
    setFromDate(dateString);
  };

  const onChangeToDate = (
    _value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: string,
  ) => {
    setToDate(dateString);
  };

  useEffect(() => {
    searchTransactionLog();
  }, [pagination.pageIndex]);

  return (
    <div className="list">
          <Space style={{ marginBottom: 16}}>
              <Select
                defaultValue="Status"
                style={{ width: 120 }}
                onChange={(val) => setStatus(parseInt(val))}
                options={[
                  { value: '0', label: 'All' },
                  { value: '1', label: 'Success' },
                  { value: '2', label: 'Fail' },
                ]}
              />
              <DatePicker placeholder="From date" onChange={onChangeFromDate} />
              <DatePicker placeholder="To date" onChange={onChangeToDate} />
              <Input 
                className="search" 
                style={{ width: 250 }}
                allowClear 
                placeholder="Receipt id or user id or nick name" 
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => searchTransactionLog()}
              />
              <Button type="primary" onClick={() => searchTransactionLog()}>Search</Button>
          </Space>
         <Table 
           rowKey="_id"
            columns={columns} 
            dataSource={logs}
            pagination={{position: ["bottomCenter"], pageSize: pagination.pageSize, current: pagination.pageIndex, total: pagination.totalRecords, onChange(page, _) {
              setPagination({...pagination, pageIndex: page})
            }}}
         />
    </div>
  );
}