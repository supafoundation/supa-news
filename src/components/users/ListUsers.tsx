import { Button, Input, Select, Space, Switch, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import UserService from "../../services/UserService";
import { Pagination, User } from "../../common/Model";

export default function ListUsers() {
  const {setLoading} = useContext(context)
  const [keyword, setKeyword] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [searchType, setSearchType] = useState<number>(0);
  const [pagination, setPagination] = useState<Pagination>({pageIndex: 1, pageSize: 10, totalRecords: 0});
  
  const columns: ColumnsType<User> = [
    {
      title: 'Nick name',
      dataIndex: 'nick_name',
      key: 'nick_name'
    },
    {
      title: 'Wallet address',
      dataIndex: 'wallet_address',
      key: 'wallet_address'
    },
    {
      title: 'Is Locked',
      key: 'action',
      render: (_, user: User) => (
        <Space size="middle">
          {user.is_locked && <Switch defaultChecked onChange={(checked: boolean) => toggleLock(checked, user)} />}
          {!user.is_locked && <Switch onChange={(checked: boolean) => toggleLock(checked, user)} />}
        </Space>
      ),
    },
  ];

  const toggleLock = (checked: boolean, user: User) => {
    const service = new UserService();
     if(checked){
       service.lockUser({wallet_address: user.wallet_address});
     }else{
       service.unlockUser({wallet_address: user.wallet_address});
     }
     setUsers(users.map(u => {
       if(u.wallet_address === user.wallet_address){
        return {...u, is_locked: true};
       }
       return u;
     }))
  }

  const searchUsers = async () => {
    setLoading(true);
    const service = new UserService();
    const res = await service.searchUsers({
      keyword: keyword,
      search_type: searchType,
      page_index: pagination.pageIndex,
      page_size: pagination.pageSize,
    });
    setUsers(res.data.users ?? []);
    setPagination({...pagination, totalRecords: res.data.total_users});
    setLoading(false);
  }

  useEffect(() => {
    searchUsers();
  }, [pagination.pageIndex]);

  return (
    <div className="list">
          <Space style={{ marginBottom: 16}}>
              <Select value={searchType.toString()} style={{ width: 200 }} onChange={(value: string) => {
                 setSearchType(parseInt(value))
              }}>
                <Select.Option key="0" value="0">All Users</Select.Option>
                <Select.Option key="1" value="1">Locked Users</Select.Option>
              </Select>
              <Input 
                className="search" allowClear style={{ width: 250 }} 
                placeholder="Wallet address or nick name" 
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => searchUsers()}
              />
              <Button type="primary" onClick={() => searchUsers()}>Search</Button>
          </Space>
         <Table 
           rowKey="_id"
            columns={columns} 
            dataSource={users}
            pagination={{position: ["bottomCenter"], pageSize: pagination.pageSize, current: pagination.pageIndex, total: pagination.totalRecords, onChange(page, _) {
              setPagination({...pagination, pageIndex: page})
            }}}
         />
    </div>
  );
}