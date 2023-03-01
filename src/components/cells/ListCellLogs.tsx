import { Button, DatePicker, Input, Space, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import { CellLog } from "./Model";
import "./Log.scss"
import FormModal from "./FormModal";
import LogService from "../../services/LogService";
import { Pagination } from "../../common/Model";
import moment from 'moment';
import { DatePickerProps, RangePickerProps } from "antd/lib/date-picker";

export default function ListCellLogs() {
  const {setLoading} = useContext(context)
  const [keyword, setKeyword] = useState<string>("")
  const [logs, setLogs] = useState<CellLog[]>([])
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({pageIndex: 1, pageSize: 10, totalRecords: 0});
  const [fromDate, setFromDate] = useState<[string, string] | string>("")
  const [toDate, setToDate] = useState<[string, string] | string>("")
  
  const columns: ColumnsType<CellLog> = [
    {
      title: 'Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (_, log: CellLog) => (
        <Space size="middle">
           {moment(log.created_at).format('MMMM Do YYYY, h:mm:ss a')}
        </Space>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'Reason',
      key: 'reason',
      render: (_, log: CellLog) => (
        <Space size="middle">
           {getPlainReason(log.reason)}
        </Space>
      ),
    },
    {
      title: 'Added Amount',
      dataIndex: 'added_amount',
      key: 'added_amount',
      render: (_, log: CellLog) => (
        <Space size="middle">
           {log.added_amount.toLocaleString("en-US")}
        </Space>
      ),
    },
    {
      title: 'Deducted Amount',
      dataIndex: 'deducted_amount',
      key: 'deducted_amount',
      render: (_, log: CellLog) => (
        <Space size="middle">
           {log.deducted_amount.toLocaleString("en-US")}
        </Space>
      ),
    },
    {
      title: 'Balance Before',
      dataIndex: 'before_balance',
      key: 'before_balance',
      render: (_, log: CellLog) => (
        <Space size="middle">
           {log.before_balance.toLocaleString("en-US")}
        </Space>
      ),
    },
    {
      title: 'Balance After',
      dataIndex: 'after_balance',
      key: 'after_balance',
      render: (_, log: CellLog) => (
        <Space size="middle">
           {log.after_balance.toLocaleString("en-US")}
        </Space>
      ),
    }
  ];
  const getPlainReason = (reason: number): string => {
    let re = "";
     switch(reason){
      case 1: re = "IRONSOURCE"; break;
      case 2: re = "CHAT_DEDUCTION"; break;
      case 3: re = "REGISTER"; break;
      case 4: re = "PURCHASE"; break;
      case 5: re = "REFER"; break;
      case 6: re = "REFER_TO_CHANNEL"; break;
      case 7: re = "ADMIN"; break;
     }
     return re;
  }

  const searchCellLog = async () => {
    setLoading(true)
    const service = new LogService();
    const res = await service.searchCellLog({
      wallet_address: keyword,
      from_date: fromDate,
      to_date: toDate,
      page_index: pagination.pageIndex,
      page_size: pagination.pageSize,
    });
    setLogs(res.data.records ?? [])
    setPagination({...pagination, totalRecords: res.data.total});
    setLoading(false);
  }

  const openFormDialog = () => {
     setOpenForm(true);
  }

  const cancelFormDialog = () => {
    setOpenForm(false);
  }

  const onChangeFromDate = (
    _value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setFromDate(dateString);
  };

  const onChangeToDate = (
    _value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setToDate(dateString);
  };

  useEffect(() => {
    searchCellLog();
  }, [pagination.pageIndex]);

  return (
    <div className="list-logs-screen">
          <Space style={{ marginBottom: 16}}>
              <Input className="search" allowClear placeholder="Wallet address" onChange={(e) => setKeyword(e.target.value)}/>
              <DatePicker placeholder="From date" onChange={onChangeFromDate} />
              <DatePicker placeholder="To date" onChange={onChangeToDate} />
              <Button type="primary" onClick={() => searchCellLog()}>Search</Button>
              <Button type="primary" onClick={() => openFormDialog()}>Add Cell</Button>
          </Space>
         <Table 
           rowKey="_id"
            columns={columns} 
            dataSource={logs}
            pagination={{position: ["bottomCenter"], pageSize: pagination.pageSize, current: pagination.pageIndex, total: pagination.totalRecords, onChange(page, _) {
              setPagination({...pagination, pageIndex: page})
            }}}
         />
        <FormModal 
          openForm={openForm}
          cancel={cancelFormDialog}
          reloadList={() => {
            setPagination({...pagination, pageIndex: 1});
            searchCellLog();
          }}
        />
    </div>
  );
}