import { Button, Modal, Select, Space, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import CategoriesService from "../../services/CategoriesService";
import NewsService from "../../services/NewsService";
import { Category } from "../categories/Model";
import FormModal from "./FormModal";
import { Item, Pagination } from "./Model";
import "./News.scss"

export default function ListNews() {
  const {setLoading} = useContext(context)
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [fullItems, setFullItems] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>();
  const [pagination, setPagination] = useState<Pagination>({pageIndex: 1, pageSize: 6, totalRecords: 0});
  
  const columns: ColumnsType<Item> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Image',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (_, item: Item) => (
        <Space size="middle">
          {item.image_url && <img src={item.image_url} width={80} height={80}/>}
        </Space>
      ),
    },
    {
      title: 'Video Url',
      dataIndex: 'video_url',
      key: 'video_url',
      render: (_, item: Item) => (
        <Space size="middle">
          {item.video_url && <a href={item.video_url}>Link</a>}
        </Space>
      ),
    },
    {
      title: 'Short Description',
      dataIndex: 'short_description',
      key: 'short_description',
    },
    {
      title: 'External Link',
      dataIndex: 'external_url',
      key: 'external_url',
      render: (_, item: Item) => (
        <Space size="middle">
          {item.external_url && <a href={item.external_url}>Link</a>}
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, item: Item) => (
        <Space size="middle">
          <a href="#!" onClick={() => openFormDialog(item)}>Edit</a>
          <a href="#!" onClick={() => openConfirmDeleteDialog(item)}>Delete</a>
        </Space>
      ),
    },
  ];

  const getItemsByCategory = async (categoryId: string) => {
    setLoading(true);
    const service = new NewsService();
    const res = await service.getItemsByCategory(categoryId, pagination.pageIndex, pagination.pageSize);
    setFullItems(res.data.data ?? []);
    setPagination({...pagination, totalRecords: res.data.total_records});
    setItems(res.data.data ?? []);
    setLoading(false);
  }

  const getAllCategories = async () => {
    setLoading(true)
    const service = new CategoriesService()
    const res = await service.getAllCategories()
    const categories = res.data?.map((cat: any) => ({
      id: cat.id,
      name: cat.name
    }))
    setCategories(categories)
    setLoading(false);
    if(res.data && res.data?.length > 0){
      setSelectedCategory(res.data[0].id);
    }
  }

  useEffect(() => {
    if(selectedCategory){
        setPagination({...pagination, pageIndex: 1});
        getItemsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if(selectedCategory){
        getItemsByCategory(selectedCategory);
    }
  }, [pagination.pageIndex]);

  const openFormDialog = (item: Item | null) => {
     setSelectedItem(item);
     setOpenForm(true);
  }

  const cancelFormDialog = () => {
    setSelectedItem(null);
    setOpenForm(false);
  }

  const openConfirmDeleteDialog = (item: Item) => {
    setSelectedItem(item);
    setOpenConfirmDelete(true);
  }

  const cancelConfirmDeleteDialog = () => {
    setSelectedItem(null);
    setOpenConfirmDelete(false);
  }

  const deleteItem = async () => {
     if(selectedItem){
      setLoading(true);
      setOpenConfirmDelete(false);
      setSelectedItem(null);
      const service = new NewsService()
      const {key, ...deletedItem} = fullItems.filter((item: any) => item.key == selectedItem.key)[0];
      await service.deleteItem({category_id: selectedCategory, item: deletedItem});
      if(pagination.pageIndex == 1){
        await getItemsByCategory(selectedCategory);
      }else{
        setPagination({...pagination, pageIndex: 1});
      }
      setLoading(false);
     }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="list-news-screen">
          <Space style={{ marginBottom: 16 }}>
              <Select value={selectedCategory} style={{ width: 200 }} onChange={(value: string) => {
                if(value != selectedCategory) setSelectedCategory(value)
              }}>
                {categories.map((cat: any) => <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>)}
              </Select>
              <Button onClick={() => openFormDialog(null)} disabled={categories.length == 0}>Create Item</Button>
          </Space>
         <Table 
            columns={columns} 
            dataSource={items} 
            pagination={{position: ["bottomCenter"], pageSize: pagination.pageSize, current: pagination.pageIndex, total: pagination.totalRecords, onChange(page, _) {
              setPagination({...pagination, pageIndex: page})
            }}}
         />
         <Modal title="Confirm" visible={openConfirmDelete} onOk={deleteItem} onCancel={cancelConfirmDeleteDialog} zIndex={0}>
            <p>Are you sure you want to delete?</p>
        </Modal>
        <FormModal 
           categories={categories} 
           selectedCategory={selectedCategory} 
           data={selectedItem} 
           openForm={openForm} 
           cancelFormDialog={cancelFormDialog} 
           reloadList={(cat: string) => getItemsByCategory(cat)}
           setSelectedCategory={(cat: string) => setSelectedCategory(cat)}
           />
    </div>
  );
}