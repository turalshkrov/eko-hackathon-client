import {
	Avatar,
	Button,
	Col,
	Flex,
	FloatButton,
	Form,
	Image,
	Input,
	Rate,
	Row,
	Space,
	Typography,
} from "antd";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import { useParams } from "react-router-dom";
import { iGallery, iPark } from "@/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { SiCodemagic } from "react-icons/si";
import { useAppDispatch } from "../../hooks/hooks";
import { setIsOpen } from "../../store/ModalSlice/modalSlice";
import Modals from "../../components/Modals";
import "./Gallery.css";
import {
	FlagOutlined,
	LoadingOutlined,
	SearchOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { toast } from "sonner";

const customIcon = new L.Icon({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	iconSize: [25, 41],
});

const { Title } = Typography;

function Park() {
	const dispatch = useAppDispatch();
	const { id } = useParams();
	const [parkData, setParkData] = useState<iPark>();
	const [loading, setLoading] = useState(false);
	const [gallery, setGallery] = useState<iGallery[]>([]);
	const [revies, setReviews] = useState<any[]>([]);
	useEffect(() => {
		setLoading(true);
		axios
			.get(`https://azercosmos-hackaton.vercel.app/parks/${id}`)
			.then((response) => {
				setParkData(response.data.data);
				setLoading(false);
			});

		axios
			.get(`https://azercosmos-hackaton.vercel.app/gallery/${id}`)
			.then((response) => {
				setGallery(response.data.data);
				setLoading(false);
			});

		axios
			.get(`https://azercosmos-hackaton.vercel.app/reviews?park_id=${id}`)
			.then((response) => {
				setReviews(response.data.data);
				setLoading(false);
			});
	}, [id]);

	const [form] = Form.useForm();
	const { getFieldsValue, resetFields } = form;
	const handleSubmit = () => {
		toast.promise(
			axios.post(`https://azercosmos-hackaton.vercel.app/reviews/`, {
				...getFieldsValue(),
				park_id: id,
			}),
			{
				loading: "Loading...",
				success: "Success",
				error: "Error",
			}
		);
		resetFields();
	};
	const handleOpenSearchModal = () => {
		dispatch(setIsOpen({ id: "search", isOpen: true }));
	};
	const handleOpenReportModal = () => {
		dispatch(setIsOpen({ id: "report", isOpen: true }));
	};

	return (
		<>
			<Row>
				{loading && (
					<Row className="!h-screen !w-full items-center" justify="center">
						<LoadingOutlined size={70} />
					</Row>
				)}
				{parkData && (
					<>
						<Header />

						<Col
							span={24}
							className="p-4 md:p-8 banner"
							style={{
								backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url("${parkData.image_url}")`,
							}}
						>
							<Title
								level={1}
								className="!font-bold !text-5xl mt-20 md:ml-16 !text-white"
							>
								{parkData.name}
							</Title>
							<Title level={3} className="!text-white md:ml-16 ">
								{parkData.description}
							</Title>
						</Col>

						<Col span={24} md={12} className="p-6 z-10 m-auto">
							<Col span={24} className="mb-4">
								<MapContainer
									center={[parkData?.latitude, parkData?.longitude]}
									zoom={12}
									style={{ height: "40vh", width: "100%" }}
								>
									<TileLayer
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									/>

									<Marker
										key={parkData.id}
										position={[parkData.latitude, parkData.longitude]}
										icon={customIcon}
									>
										<Popup>
											<Title level={5}>{parkData.name}</Title>
										</Popup>
									</Marker>
								</MapContainer>
							</Col>

							<Title level={2} className="!font-bold">
								Gallery
							</Title>

							<Col span={24} className="grid-gallery mt-4">
								{gallery.map((item) => (
									<Image
										key={item.id}
										src={item.image_url}
										className="w-full !h-full p-3 "
									/>
								))}
							</Col>

							<Form className="mt-8" form={form}>
								<Title level={4}>Add a review</Title>
								<Form.Item name="rating" label="Rating">
									<Rate />
								</Form.Item>
								<Form.Item name="description">
									<Input.TextArea placeholder="Write description" />
								</Form.Item>
								<Button type="primary" size="large" onClick={handleSubmit}>
									Add Review
								</Button>
							</Form>

							{revies.length > 0 && (
								<>
									<Title level={2} className="!font-bold mt-8">
										Reviews
									</Title>
									<Col span={24} className="mt-8">
										{revies.map((item) => (
											<Space key={item.id} className="mb-8 w-full">
												<Avatar icon={<UserOutlined />} size={50} />
												<Flex className="flex-col ml-4">
													<Title level={5} type="secondary">
														{item.description}
													</Title>
													<Rate disabled value={item.rating} />
												</Flex>
											</Space>
										))}
									</Col>
								</>
							)}
						</Col>
					</>
				)}
				<FloatButton.Group
					trigger="click"
					shape="circle"
					style={{ right: 30, bottom: 30, width: 50, height: 50 }}
					icon={<SiCodemagic />}
				>
					<FloatButton
						onClick={handleOpenReportModal}
						icon={<FlagOutlined />}
						tooltip="Report"
					/>
					<FloatButton
						onClick={handleOpenSearchModal}
						icon={<SearchOutlined />}
						tooltip="Search"
					/>
				</FloatButton.Group>

				<Modals />
			</Row>
			<Footer />
		</>
	);
}

export default Park;
