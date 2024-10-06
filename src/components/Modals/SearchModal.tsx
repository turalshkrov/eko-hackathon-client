import { UploadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setIsOpen } from "../../store/ModalSlice/modalSlice";
import { modalIsOpenSelector } from "../../store/selectors";
import {
	Button,
	Modal,
	Upload,
	Typography,
	Form,
	Tabs,
	Radio,
	AutoComplete,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { iPlant } from "../../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const { Title } = Typography;

export const SearchModal = () => {
	const [plantImage, setPlantImage] = useState<string>();
	const [selectedPlant, setSelectedPlant] = useState<string>();
	const navigate = useNavigate();
	const [form] = useForm();
	const { setFieldValue } = form;
	const handleSubmit = async () => {
		if (!selectedPlant) {
			dispatch(setIsOpen({ id: "search", isOpen: false }));
			selectedPlant && navigate(`/plants/${selectedPlant}`);
		}
		if (plantImage) {
			axios
				.post(`https://azercosmos-hackaton.vercel.app/plants/file`, {
					image: plantImage,
				})
				.then((response) => {
					navigate(`/plants/${response.data.data.id}`);
				})
				.catch(() => toast.error("No plants found"));
		}
	};
	const dispatch = useAppDispatch();
	const isOpen = useAppSelector((state) =>
		modalIsOpenSelector(state, "search")
	);
	const handleCloseModal = () => {
		dispatch(setIsOpen({ id: "search", isOpen: false }));
	};

	const [plants, setPlants] = useState<iPlant[]>([]);

	const handlePlantSearch = async (value: string) => {
		const response = await axios.get(
			`https://azercosmos-hackaton.vercel.app/plants/all?name=${value || ""}`
		);
		setPlants(response.data.data);
	};

	const beforeUpload = (file: File) => {
		const isImage = file.type.startsWith("image/");
		if (!isImage) {
			return Upload.LIST_IGNORE; // Prevent upload
		}

		const reader = new FileReader();
		reader.onload = () => {
			const base64String = reader.result as string;
			setFieldValue("image", base64String);
			setPlantImage(base64String.replace(/^data:image\/\w+;base64,/, ""));
		};

		reader.readAsDataURL(file);
		return false;
	};

	const handlePlantChange = (value: string) => {
		setSelectedPlant(value);
	};

	return (
		<Modal
			title="Find plants or animals"
			centered
			open={isOpen}
			onCancel={handleCloseModal}
			onOk={handleSubmit}
		>
			<Title level={5} type="secondary" className="mt-2">
				Search with image or text
			</Title>
			<Form className="mt-4" form={form}>
				<Form.Item name="type">
					<Radio.Group
						options={[
							{ label: "Plant", value: "plant" },
							{ label: "Animal", value: "animal" },
						]}
						optionType="button"
					/>
				</Form.Item>
				<Tabs
					items={[
						{
							label: "Image",
							key: "image",
							children: (
								<Form.Item name="image">
									<Upload beforeUpload={beforeUpload} multiple={false}>
										<Button icon={<UploadOutlined />} className="mt-2">
											Click to Upload
										</Button>
									</Upload>
								</Form.Item>
							),
						},
						{
							label: "Text",
							key: "text",
							children: (
								<AutoComplete
									options={plants.map((plant) => ({
										key: plant.id,
										label: plant.name,
										value: plant.name,
									}))}
									onSearch={handlePlantSearch}
									onSelect={(_, record) => handlePlantChange(record.key)}
									className="w-full"
									size="large"
								/>
							),
						},
					]}
				/>
			</Form>
		</Modal>
	);
};
