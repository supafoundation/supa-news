import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { useContext, useEffect, useState } from "react";
import { context } from "../../App";
import { Category } from "./Model";
import "./Categories.scss"
import CategoriesService from "../../services/CategoriesService";
import FormModal from "./FormModal";

export default function ListCategories() {
  const {setLoading} = useContext(context)
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);

  const columns: ColumnsType<Category> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, cat: Category) => (
        <Space size="middle">
          <a href="#!" onClick={() => openFormDialog(cat)}>Edit</a>
          <a href="#!" onClick={() => openConfirmDeleteDialog(cat)}>Delete</a>
        </Space>
      ),
    },
  ];

  const getAllCategories = async () => {
    setLoading(true)
    const service = new CategoriesService()
    const res = await service.getAllCategories()
    const categories = res.data?.map((cat: any) => ({
      id: cat.id,
      name: cat.name
    }))
    setCategories(categories);
    setLoading(false);
  }

  const openFormDialog = (cat: Category | null) => {
     setSelectedCategory(cat);
     setOpenForm(true);
  }

  const cancelFormDialog = () => {
    setSelectedCategory(null);
    setOpenForm(false);
  }

  const openConfirmDeleteDialog = (cat: Category) => {
    setSelectedCategory(cat);
    setOpenConfirmDelete(true);
  }

  const cancelConfirmDeleteDialog = () => {
    setSelectedCategory(null);
    setOpenConfirmDelete(false);
  }

  const deleteCategory = async () => {
    setLoading(true);
    setOpenConfirmDelete(false);
    const service = new CategoriesService();
    await service.deleteCategory(selectedCategory?.id ?? "");
    setSelectedCategory(null);
    getAllCategories();
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="list-categories-screen">
          <Space style={{ marginBottom: 16 }}>
              <Button onClick={() => openFormDialog(null)}>Create Category</Button>
          </Space>
         <Table columns={columns} dataSource={categories}/>
         <Modal title="Confirm" visible={openConfirmDelete} onOk={deleteCategory} onCancel={cancelConfirmDeleteDialog} zIndex={0}>
            <p>Are you sure you want to delete?</p>
        </Modal>
        <FormModal 
           data={selectedCategory} 
           openForm={openForm} 
           cancelFormDialog={cancelFormDialog} 
           reloadList={() => getAllCategories()}
           />
    </div>
  );
}