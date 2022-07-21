import { Button, Modal, Select, Space, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import NewsService from "../../services/NewsService";
import { Category, Item, Pagination } from "./Model";
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
      dataIndex: 'image',
      key: 'image',
      render: (_, { image }: Item) => (
        <img src={image} width={80} height={80}/>
      ),
    },
    {
      title: 'Video Url',
      dataIndex: 'video',
      key: 'video',
    },
    {
      title: 'Short Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, item: Item) => (
        <Space size="middle">
          <a href="javascript:void(0)" onClick={() => openFormDialog(item)}>Edit</a>
          <a href="javascript:void(0)" onClick={() => openConfirmDeleteDialog(item)}>Delete</a>
        </Space>
      ),
    },
  ];

  const getItemsByCategory = async (categoryId: string) => {
    setLoading(true)
    const service = new NewsService()
    const res = await service.getItemsByCategory(categoryId, pagination.pageIndex, pagination.pageSize)
    setFullItems(res.data.data ?? [])
    setPagination({...pagination, totalRecords: res.data.total_records})
    const items = res.data.data?.map((item: any) => ({
      key: item.item_id,
      title: item.title,
      image: item.image_url,
      video: item.video_url,
      shortDescription: item.short_description,
      description: item.description
    })) ?? []
    setItems(items)
    setLoading(false)
  }

  const getAllCategories = async () => {
    setLoading(true)
    const service = new NewsService()
    const res = await service.getAllCategories()
    const categories = res.data?.map((cat: any) => ({
      id: cat.id,
      name: cat.name
    }))
    setCategories(categories)
    if(res.data && res.data?.length > 0){
      setSelectedCategory(res.data[0].id)
    }
    setLoading(false)
  }

  useEffect(() => {
    if(selectedCategory){
        setPagination({...pagination, pageIndex: 1})
        getItemsByCategory(selectedCategory)
    }
  }, [selectedCategory]);

  useEffect(() => {
    if(selectedCategory){
        getItemsByCategory(selectedCategory)
    }
  }, [pagination.pageIndex]);

  const openFormDialog = (item: Item | null) => {
     setSelectedItem(item)
     setOpenForm(true)
  }

  const cancelFormDialog = () => {
    setSelectedItem(null)
    setOpenForm(false)
  }

  const submitForm = () => {
      console.log(selectedItem)
  }

  const openConfirmDeleteDialog = (item: Item) => {
    setSelectedItem(item)
    setOpenConfirmDelete(true)
  }

  const cancelConfirmDeleteDialog = () => {
    setSelectedItem(null)
    setOpenConfirmDelete(false)
  }

  const deleteItem = async () => {
     if(selectedItem){
      setLoading(true)
      setOpenConfirmDelete(false)
      const service = new NewsService()
      const {item_id, ...deletedItem} = fullItems.filter((item: any) => item.item_id == selectedItem.key)[0]
      await service.deleteItem({category_id: selectedCategory, item: deletedItem})
      if(pagination.pageIndex == 1){
        await getItemsByCategory(selectedCategory)
      }else{
        setPagination({...pagination, pageIndex: 1})
      }
      setLoading(false)
     }
  }

  useEffect(() => {
    getAllCategories()
  }, []);

  return (
    <div className="list-news-screen">
          <Space style={{ marginBottom: 16 }}>
              <Select value={selectedCategory} style={{ width: 200 }} onChange={(value: string) => {
                if(value != selectedCategory) setSelectedCategory(value)
              }}>
                {categories.map((cat: any) => <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>)}
              </Select>
              <Button onClick={() => openFormDialog(null)}>Create Item</Button>
          </Space>
         <Table columns={columns} dataSource={items} pagination={{position: ["bottomCenter"], pageSize: pagination.pageSize, current: pagination.pageIndex, total: pagination.totalRecords, onChange(page, _) {
              console.log(page)
              setPagination({...pagination, pageIndex: page})
         },}}/>
         <Modal title="Confirm" visible={openConfirmDelete} onOk={deleteItem} onCancel={cancelConfirmDeleteDialog}>
            <p>Are you sure you want to delete?</p>
        </Modal>
        <Modal title="Edit Form" visible={openForm} onOk={() => submitForm()} onCancel={cancelFormDialog}>
            <p>Edit</p>
        </Modal>
    </div>
  );
}