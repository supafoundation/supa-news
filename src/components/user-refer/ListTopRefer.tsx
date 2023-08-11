import { Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import { ReferCount } from "./Model";
import { Pagination } from "../../common/Model";
import UserService from "../../services/UserService";
import "./TopRefer.scss"

export default function ListTopRefer() {
  const {setLoading} = useContext(context)
  const [referCounts, setReferCounts] = useState<ReferCount[]>([]);
  const [pagination, setPagination] = useState<Pagination>({pageIndex: 1, pageSize: 10, totalRecords: 0});

  const columns: ColumnsType<ReferCount> = [
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Nick Name',
      dataIndex: 'nick_name',
      key: 'nick_name',
    },
    {
      title: 'Total Referal',
      dataIndex: 'total_refered_users',
      key: 'total_refered_users',
    }
  ];

  const getTopRefer = async () => {
    setLoading(true)
    const service = new UserService()
    const res = await service.getTopRefer(pagination.pageIndex, pagination.pageSize);
    setReferCounts(res.data.records);
    setPagination({...pagination, totalRecords: res.data.total});
    setLoading(false);
  }

  useEffect(() => {
    getTopRefer();
  }, []);

  return (
    <div className="list-spark-balance-screen">
         <Table 
            rowKey="nick_name"
            columns={columns} 
            dataSource={referCounts}
            pagination={{position: ["bottomCenter"], pageSize: pagination.pageSize, current: pagination.pageIndex, total: pagination.totalRecords, onChange(page, _) {
              setPagination({...pagination, pageIndex: page})
            }}}
          />
    </div>
  );
}