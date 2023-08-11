import { Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import { SparkBalance } from "./Model";
import SupaChargeService from "../../services/SupaChargeService";
import { Pagination } from "../../common/Model";
import "./SparkBalance.scss"

export default function ListTopSparkBalance() {
  const {setLoading} = useContext(context)
  const [sparkBalances, setSparkBalances] = useState<SparkBalance[]>([]);
  const [pagination, setPagination] = useState<Pagination>({pageIndex: 1, pageSize: 10, totalRecords: 0});

  const columns: ColumnsType<SparkBalance> = [
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
      title: 'Balance',
      dataIndex: 'amount',
      key: 'amount',
    }
  ];

  const getTopSparkBalance = async () => {
    setLoading(true)
    const service = new SupaChargeService()
    const res = await service.getTopSparkBalance(pagination.pageIndex, pagination.pageSize);
    setSparkBalances(res.data.records);
    setPagination({...pagination, totalRecords: res.data.total});
    setLoading(false);
  }

  useEffect(() => {
    getTopSparkBalance();
  }, []);

  return (
    <div className="list-spark-balance-screen">
         <Table 
            rowKey="nick_name"
            columns={columns} 
            dataSource={sparkBalances}
            pagination={{position: ["bottomCenter"], pageSize: pagination.pageSize, current: pagination.pageIndex, total: pagination.totalRecords, onChange(page, _) {
              setPagination({...pagination, pageIndex: page})
            }}}
          />
    </div>
  );
}